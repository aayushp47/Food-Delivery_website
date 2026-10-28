from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

import models
import schemas
from auth_security import require_roles
from database import get_db


router = APIRouter(tags=["Reservations"])
RESERVATION_STAFF = require_roles("owner", "manager", "waiter")


@router.get(
    "/reservations",
    response_model=list[schemas.ReservationResponse],
    dependencies=[Depends(RESERVATION_STAFF)]
)
def get_reservations(db: Session = Depends(get_db)):

    return db.query(models.Reservation).order_by(
        models.Reservation.reservation_at
    ).all()


@router.post(
    "/reservations",
    response_model=schemas.ReservationResponse,
    status_code=201,
    dependencies=[Depends(RESERVATION_STAFF)]
)
def create_reservation(
    reservation: schemas.ReservationCreate,
    db: Session = Depends(get_db)
):

    booking = models.Reservation(**reservation.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking