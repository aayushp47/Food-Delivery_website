from sqlalchemy.orm import Session

import models
import schemas


# =================================
# GET ALL DISHES
# =================================

def get_all_dishes(db: Session):

    return db.query(
        models.Dish
    ).all()


# =================================
# GET ONE DISH
# =================================

def get_dish(
    db: Session,
    dish_id: int
):

    return db.query(
        models.Dish
    ).filter(
        models.Dish.id == dish_id
    ).first()


# =================================
# CREATE DISH
# =================================

def create_dish(
    db: Session,
    dish: schemas.DishCreate
):

    new_dish = models.Dish(
        name=dish.name,
        price=dish.price,
        description=dish.description,
        image=dish.image,
        type=dish.type,
        category=dish.category
    )

    db.add(new_dish)

    db.commit()

    db.refresh(new_dish)

    return new_dish


# =================================
# UPDATE DISH
# =================================

def update_dish(
    db: Session,
    dish_id: int,
    dish: schemas.DishCreate
):

    existing_dish = db.query(
        models.Dish
    ).filter(
        models.Dish.id == dish_id
    ).first()


    if existing_dish is None:

        return None


    existing_dish.name = dish.name

    existing_dish.price = dish.price

    existing_dish.description = dish.description

    existing_dish.image = dish.image

    existing_dish.type = dish.type

    existing_dish.category = dish.category


    db.commit()

    db.refresh(existing_dish)


    return existing_dish


# =================================
# DELETE DISH
# =================================

def delete_dish(
    db: Session,
    dish_id: int
):

    existing_dish = db.query(
        models.Dish
    ).filter(
        models.Dish.id == dish_id
    ).first()


    if existing_dish is None:

        return None


    db.delete(existing_dish)

    db.commit()


    return existing_dish


def get_all_inventory_items(db: Session):

    return db.query(models.InventoryItem).order_by(
        models.InventoryItem.id.desc()
    ).all()


def create_inventory_item(db: Session, item: schemas.InventoryItemCreate):

    inventory_item = models.InventoryItem(**item.model_dump())
    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def update_inventory_item(
    db: Session,
    item_id: int,
    item: schemas.InventoryItemCreate
):

    inventory_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if inventory_item is None:
        return None

    for field, value in item.model_dump().items():
        setattr(inventory_item, field, value)

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


# =================================
# ADDRESSES
# =================================

def get_all_addresses(db: Session):

    return db.query(models.Address).order_by(
        models.Address.id.desc()
    ).all()


def create_address(db: Session, address: schemas.AddressCreate):

    new_address = models.Address(**address.model_dump())

    db.add(new_address)
    db.commit()
    db.refresh(new_address)

    return new_address


def update_address(
    db: Session,
    address_id: int,
    address: schemas.AddressCreate
):

    existing_address = db.query(models.Address).filter(
        models.Address.id == address_id
    ).first()

    if existing_address is None:
        return None

    for field, value in address.model_dump().items():
        setattr(existing_address, field, value)

    db.commit()
    db.refresh(existing_address)

    return existing_address


def delete_address(db: Session, address_id: int):

    address = db.query(models.Address).filter(
        models.Address.id == address_id
    ).first()

    if address is None:
        return None

    db.delete(address)
    db.commit()

    return address


# =================================
# ORDERS
# =================================

def create_order(db: Session, order: schemas.OrderCreate):

    address = db.query(models.Address).filter(
        models.Address.id == order.address_id
    ).first()

    if address is None:
        return None, "Address not found"

    requested_ids = [item.dish_id for item in order.items]
    dishes = db.query(models.Dish).filter(
        models.Dish.id.in_(requested_ids)
    ).all()
    dishes_by_id = {dish.id: dish for dish in dishes}

    if len(dishes_by_id) != len(set(requested_ids)):
        return None, "One or more dishes were not found"

    items = []
    subtotal = 0

    for item in order.items:
        if item.quantity < 1:
            return None, "Quantity must be at least 1"

        dish = dishes_by_id[item.dish_id]
        line_total = round(dish.price * item.quantity, 2)
        subtotal += line_total

        items.append({
            "dish_id": dish.id,
            "name": dish.name,
            "price": dish.price,
            "quantity": item.quantity,
            "line_total": line_total
        })

    subtotal = round(subtotal, 2)
    delivery_fee = 0 if subtotal >= 299 else 40
    platform_fee = 15
    discount = max(0, min(order.discount, subtotal + delivery_fee + platform_fee))
    total = round(subtotal + delivery_fee + platform_fee - discount, 2)

    new_order = models.Order(
        address_id=order.address_id,
        payment_method=order.payment_method,
        subtotal=subtotal,
        discount=discount,
        delivery_fee=delivery_fee,
        platform_fee=platform_fee,
        total=total,
        items=items,
        delivery_instructions=order.delivery_instructions,
        scheduled_delivery=order.scheduled_delivery
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order, None