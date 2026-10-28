from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from auth_security import require_roles


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.get(
    "/",
    response_model=list[schemas.InventoryItemResponse],
    dependencies=[Depends(require_roles("owner", "manager", "chef"))]
)
def get_inventory(db: Session = Depends(get_db)):

    return crud.get_all_inventory_items(db)


@router.post(
    "/",
    response_model=schemas.InventoryItemResponse,
    status_code=201,
    dependencies=[Depends(require_roles("owner", "manager", "chef"))]
)
def create_inventory_item(
    item: schemas.InventoryItemCreate,
    db: Session = Depends(get_db)
):

    return crud.create_inventory_item(db, item)


@router.put(
    "/{item_id}",
    response_model=schemas.InventoryItemResponse,
    dependencies=[Depends(require_roles("owner", "manager", "chef"))]
)
def update_inventory_item(
    item_id: int,
    item: schemas.InventoryItemCreate,
    db: Session = Depends(get_db)
):

    updated_item = crud.update_inventory_item(db, item_id, item)

    if updated_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    return updated_item