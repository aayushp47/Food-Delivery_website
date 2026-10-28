from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

import crud
import schemas

from database import get_db
from auth_security import require_roles


router = APIRouter(
    prefix="/dishes",
    tags=["Dishes"]
)


# =================================
# GET ALL
# =================================

@router.get(
    "/",
    response_model=list[schemas.DishResponse]
)
def get_dishes(
    db: Session = Depends(get_db)
):

    return crud.get_all_dishes(db)


# =================================
# GET ONE
# =================================

@router.get(
    "/{dish_id}",
    response_model=schemas.DishResponse
)
def get_single_dish(
    dish_id: int,
    db: Session = Depends(get_db)
):

    dish = crud.get_dish(
        db,
        dish_id
    )


    if dish is None:

        raise HTTPException(
            status_code=404,
            detail="Dish not found"
        )


    return dish


# =================================
# CREATE
# =================================

@router.post(
    "/",
    response_model=schemas.DishResponse,
    dependencies=[Depends(require_roles("owner", "manager"))]
)
def create_new_dish(
    dish: schemas.DishCreate,
    db: Session = Depends(get_db)
):

    return crud.create_dish(
        db,
        dish
    )


# =================================
# UPDATE
# =================================

@router.put(
    "/{dish_id}",
    response_model=schemas.DishResponse,
    dependencies=[Depends(require_roles("owner", "manager"))]
)
def update_existing_dish(
    dish_id: int,
    dish: schemas.DishCreate,
    db: Session = Depends(get_db)
):

    updated_dish = crud.update_dish(
        db,
        dish_id,
        dish
    )


    if updated_dish is None:

        raise HTTPException(
            status_code=404,
            detail="Dish not found"
        )


    return updated_dish


# =================================
# DELETE
# =================================

@router.delete(
    "/{dish_id}",
    dependencies=[Depends(require_roles("owner", "manager"))]
)
def delete_existing_dish(
    dish_id: int,
    db: Session = Depends(get_db)
):

    deleted_dish = crud.delete_dish(
        db,
        dish_id
    )


    if deleted_dish is None:

        raise HTTPException(
            status_code=404,
            detail="Dish not found"
        )


    return {
        "message": "Dish deleted successfully",
        "id": dish_id
    }