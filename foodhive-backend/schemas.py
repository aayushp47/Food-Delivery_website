from pydantic import BaseModel
from pydantic import Field
from datetime import datetime
from typing import Literal


class DishBase(BaseModel):

    name: str

    price: float

    description: str | None = None

    image: str | None = None

    type: str

    category: str


class DishCreate(DishBase):
    pass


class DishResponse(DishBase):

    id: int

    class Config:
        from_attributes = True


class AddressBase(BaseModel):

    type: str

    name: str

    phone: str

    address: str

    city: str

    pincode: str


class AddressCreate(AddressBase):
    pass


class AddressResponse(AddressBase):

    id: int

    class Config:
        from_attributes = True


class OrderItem(BaseModel):

    dish_id: int

    quantity: int


class OrderCreate(BaseModel):

    address_id: int

    payment_method: str

    items: list[OrderItem]

    discount: float = 0

    delivery_instructions: str | None = None

    scheduled_delivery: datetime | None = None


class OrderResponse(BaseModel):

    id: int

    address_id: int

    payment_method: str

    subtotal: float

    discount: float

    delivery_fee: float

    platform_fee: float

    total: float

    status: str

    items: list[dict]
    created_at: datetime

    delivery_instructions: str | None = None

    scheduled_delivery: datetime | None = None

    class Config:
        from_attributes = True


class InventoryItemBase(BaseModel):

    item: str
    category: str
    stock: float
    unit: str
    reorder_level: float
    supplier: str
    status: str


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemResponse(InventoryItemBase):

    id: int
    last_updated: datetime

    class Config:
        from_attributes = True


class ReservationCreate(BaseModel):

    guest_name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=7, max_length=24)
    party_size: int = Field(ge=1)
    table_label: str = Field(min_length=1, max_length=30)
    reservation_at: datetime


class ReservationResponse(ReservationCreate):

    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


StaffRole = Literal["owner", "manager", "chef", "waiter"]


class StaffLogin(BaseModel):

    email: str
    password: str


class StaffCreate(BaseModel):

    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)
    role: StaffRole


class StaffUpdate(BaseModel):

    role: StaffRole | None = None
    is_active: bool | None = None


class StaffPasswordChange(BaseModel):

    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class StaffResponse(BaseModel):

    id: int
    name: str
    email: str
    role: StaffRole
    is_active: bool
    must_change_password: bool
    created_at: datetime

    class Config:
        from_attributes = True