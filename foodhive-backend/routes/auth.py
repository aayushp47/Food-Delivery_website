import re

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Response
from sqlalchemy.orm import Session

import models
import schemas
from auth_security import COOKIE_SECURE
from auth_security import PASSWORD_HASHER
from auth_security import SESSION_COOKIE
from auth_security import SESSION_TTL
from auth_security import create_session_token
from auth_security import get_current_staff
from auth_security import hash_password
from auth_security import require_roles
from auth_security import verify_password
from database import get_db


router = APIRouter(prefix="/auth", tags=["Authentication"])
OWNER_ONLY = require_roles("owner")
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def normalize_email(email: str) -> str:

    normalized = email.strip().lower()
    if not EMAIL_PATTERN.fullmatch(normalized):
        raise HTTPException(status_code=422, detail="Enter a valid email address")
    return normalized


def set_session_cookie(response: Response, staff: models.StaffUser):

    response.set_cookie(
        key=SESSION_COOKIE,
        value=create_session_token(staff),
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="strict",
        path="/"
    )


@router.post("/login", response_model=schemas.StaffResponse)
def login(
    credentials: schemas.StaffLogin,
    response: Response,
    db: Session = Depends(get_db)
):

    email = credentials.email.strip().lower()
    staff = db.query(models.StaffUser).filter(
        models.StaffUser.email == email
    ).first()

    valid_password = (
        staff is not None
        and verify_password(credentials.password, staff.password_hash)
    )

    if not valid_password or not staff.is_active:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    set_session_cookie(response, staff)
    return staff


@router.post("/logout")
def logout(response: Response):

    response.delete_cookie(
        key=SESSION_COOKIE,
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="strict"
    )
    return {"message": "Signed out"}


@router.get("/me", response_model=schemas.StaffResponse)
def current_staff(staff: models.StaffUser = Depends(get_current_staff)):

    return staff


@router.post("/change-password", response_model=schemas.StaffResponse)
def change_password(
    credentials: schemas.StaffPasswordChange,
    staff: models.StaffUser = Depends(get_current_staff),
    db: Session = Depends(get_db)
):

    if not verify_password(credentials.current_password, staff.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    staff.password_hash = hash_password(credentials.new_password)
    staff.must_change_password = False
    db.commit()
    db.refresh(staff)

    return staff


@router.get("/users", response_model=list[schemas.StaffResponse])
def list_staff(
    db: Session = Depends(get_db),
    _: models.StaffUser = Depends(OWNER_ONLY)
):

    return db.query(models.StaffUser).order_by(models.StaffUser.id).all()


@router.post(
    "/users",
    response_model=schemas.StaffResponse,
    status_code=201
)
def create_staff(
    staff_data: schemas.StaffCreate,
    db: Session = Depends(get_db),
    _: models.StaffUser = Depends(OWNER_ONLY)
):

    email = normalize_email(staff_data.email)
    existing = db.query(models.StaffUser).filter(
        models.StaffUser.email == email
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    staff = models.StaffUser(
        name=staff_data.name.strip(),
        email=email,
        password_hash=hash_password(staff_data.password),
        role=staff_data.role,
        is_active=True,
        must_change_password=True
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)

    return staff


@router.patch("/users/{staff_id}", response_model=schemas.StaffResponse)
def update_staff(
    staff_id: int,
    update: schemas.StaffUpdate,
    db: Session = Depends(get_db),
    current_owner: models.StaffUser = Depends(OWNER_ONLY)
):

    staff = db.query(models.StaffUser).filter(
        models.StaffUser.id == staff_id
    ).first()

    if staff is None:
        raise HTTPException(status_code=404, detail="Staff account not found")

    changes = update.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=422, detail="Provide a role or account status")

    if staff.id == current_owner.id and (
        changes.get("role", staff.role) != "owner"
        or changes.get("is_active", staff.is_active) is False
    ):
        raise HTTPException(status_code=400, detail="You cannot remove your own owner access")

    is_losing_owner_access = staff.role == "owner" and staff.is_active and (
        changes.get("role", staff.role) != "owner"
        or changes.get("is_active", staff.is_active) is False
    )

    if is_losing_owner_access:
        active_owners = db.query(models.StaffUser).filter(
            models.StaffUser.role == "owner",
            models.StaffUser.is_active.is_(True)
        ).count()
        if active_owners <= 1:
            raise HTTPException(status_code=400, detail="At least one active owner must remain")

    for field, value in changes.items():
        setattr(staff, field, value)

    db.commit()
    db.refresh(staff)

    return staff