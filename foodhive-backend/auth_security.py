import os
import secrets
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from pathlib import Path

import jwt
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

import models
from database import get_db


SESSION_COOKIE = "foodhive_session"
SESSION_TTL = timedelta(hours=8)
COOKIE_SECURE = os.getenv("FOODHIVE_COOKIE_SECURE", "false").lower() == "true"
PASSWORD_HASHER = PasswordHash.recommended()


def _load_signing_key():

    configured_key = os.getenv("FOODHIVE_AUTH_SECRET")
    if configured_key:
        return configured_key

    secret_path = Path(__file__).resolve().parent / ".auth_secret"

    try:
        return secret_path.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        generated_key = secrets.token_urlsafe(48)

        try:
            descriptor = os.open(
                secret_path,
                os.O_WRONLY | os.O_CREAT | os.O_EXCL,
                0o600
            )
        except FileExistsError:
            return secret_path.read_text(encoding="utf-8").strip()

        with os.fdopen(descriptor, "w", encoding="utf-8") as secret_file:
            secret_file.write(generated_key)

        return generated_key


SIGNING_KEY = _load_signing_key()


def hash_password(password: str) -> str:

    return PASSWORD_HASHER.hash(password)


def verify_password(password: str, password_hash: str) -> bool:

    return PASSWORD_HASHER.verify(password, password_hash)


def create_session_token(user: models.StaffUser) -> str:

    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": str(user.id), "iat": now, "exp": now + SESSION_TTL},
        SIGNING_KEY,
        algorithm="HS256"
    )


def get_current_staff(
    request: Request,
    db: Session = Depends(get_db)
):

    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    try:
        payload = jwt.decode(
            token,
            SIGNING_KEY,
            algorithms=["HS256"],
            options={"require": ["exp", "sub"]}
        )
        staff_id = int(payload["sub"])
    except (jwt.InvalidTokenError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    staff = db.query(models.StaffUser).filter(
        models.StaffUser.id == staff_id
    ).first()

    if staff is None or not staff.is_active:
        raise HTTPException(status_code=401, detail="Staff account is inactive")

    return staff


def require_roles(*roles: str):

    def check_role(staff: models.StaffUser = Depends(get_current_staff)):
        if staff.must_change_password:
            raise HTTPException(status_code=403, detail="Change your temporary password first")
        if staff.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return staff

    return check_role