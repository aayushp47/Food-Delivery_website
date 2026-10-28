from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import desc

import crud
import schemas
import models

from database import get_db
from auth_security import require_roles


router = APIRouter(tags=["Checkout"])


@router.get(
    "/orders",
    response_model=list[schemas.OrderResponse],
    dependencies=[Depends(require_roles("owner", "manager", "waiter", "chef"))]
)
def get_orders(db: Session = Depends(get_db)):

    return db.query(models.Order).order_by(
        desc(models.Order.created_at)
    ).all()


@router.get(
    "/addresses",
    response_model=list[schemas.AddressResponse]
)
def get_addresses(db: Session = Depends(get_db)):

    return crud.get_all_addresses(db)


@router.post(
    "/addresses",
    response_model=schemas.AddressResponse,
    status_code=201
)
def add_address(
    address: schemas.AddressCreate,
    db: Session = Depends(get_db)
):

    return crud.create_address(db, address)


@router.put(
    "/addresses/{address_id}",
    response_model=schemas.AddressResponse
)
def edit_address(
    address_id: int,
    address: schemas.AddressCreate,
    db: Session = Depends(get_db)
):

    updated = crud.update_address(db, address_id, address)

    if updated is None:
        raise HTTPException(status_code=404, detail="Address not found")

    return updated


@router.delete("/addresses/{address_id}")
def remove_address(
    address_id: int,
    db: Session = Depends(get_db)
):

    deleted = crud.delete_address(db, address_id)

    if deleted is None:
        raise HTTPException(status_code=404, detail="Address not found")

    return {"message": "Address deleted successfully"}


@router.post(
    "/orders",
    response_model=schemas.OrderResponse,
    status_code=201
)
def place_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db)
):

    created_order, error = crud.create_order(db, order)

    if error:
        raise HTTPException(status_code=400, detail=error)

    return created_order