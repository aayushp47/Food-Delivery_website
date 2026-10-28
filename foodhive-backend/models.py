from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Float
from sqlalchemy import JSON
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func

from database import Base


class Dish(Base):

    __tablename__ = "dishes"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String(100),
        nullable=False
    )


    price = Column(
        Float,
        nullable=False
    )


    description = Column(
        String(500),
        nullable=True
    )


    image = Column(
        String(255),
        nullable=True
    )


    type = Column(
        String(20),
        nullable=False
    )


    category = Column(
        String(50),
        nullable=False
    )


class Address(Base):

    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(String(20), nullable=False)

    name = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False)

    address = Column(String(255), nullable=False)

    city = Column(String(100), nullable=False)

    pincode = Column(String(10), nullable=False)


class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    address_id = Column(
        Integer,
        ForeignKey("addresses.id"),
        nullable=False
    )

    payment_method = Column(String(20), nullable=False)

    subtotal = Column(Float, nullable=False)

    discount = Column(Float, nullable=False, default=0)

    delivery_fee = Column(Float, nullable=False)

    platform_fee = Column(Float, nullable=False)

    total = Column(Float, nullable=False)

    status = Column(String(30), nullable=False, default="placed")

    items = Column(JSON, nullable=False)

    delivery_instructions = Column(Text, nullable=True)

    scheduled_delivery = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )


class InventoryItem(Base):

    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    item = Column(String(120), nullable=False)
    category = Column(String(50), nullable=False)
    stock = Column(Float, nullable=False, default=0)
    unit = Column(String(30), nullable=False)
    reorder_level = Column(Float, nullable=False, default=0)
    supplier = Column(String(150), nullable=False)
    status = Column(String(30), nullable=False, default="Healthy")
    last_updated = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )


class Reservation(Base):

    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String(120), nullable=False)
    phone = Column(String(24), nullable=False)
    party_size = Column(Integer, nullable=False)
    table_label = Column(String(30), nullable=False)
    reservation_at = Column(DateTime, nullable=False, index=True)
    status = Column(String(20), nullable=False, default="confirmed")
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class StaffUser(Base):

    __tablename__ = "staff_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(254), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    is_active = Column(Integer, nullable=False, default=1)
    must_change_password = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, nullable=False, server_default=func.now())