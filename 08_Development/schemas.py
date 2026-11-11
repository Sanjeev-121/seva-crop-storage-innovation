from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    name: str
    phone: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=6)
    village: str | None = None
    district: str | None = None
    state: str | None = None


class UserLogin(BaseModel):
    phone: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    phone: str
    village: str | None
    district: str | None
    state: str | None


class Token(BaseModel):
    access_token: str
    token_type: str


class StorageCreate(BaseModel):
    name: str
    type: str | None = None
    district: str | None = None
    state: str | None = None
    capacity_kg: float | None = None
    available_kg: float | None = None
    min_quantity_kg: float = 0
    price_per_kg_month: float | None = None
    other_charges: str | None = None
    contact_phone: str | None = None


class StorageOut(StorageCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ApplicationCreate(BaseModel):
    storage_id: int
    crop: str
    quantity_kg: float = Field(gt=0)
    duration_months: int = Field(default=1, ge=1)


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    farmer_id: int
    storage_id: int
    crop: str
    quantity_kg: float
    duration_months: int
    status: str
    created_at: datetime


class StatusUpdate(BaseModel):
    status: Literal["pending", "approved", "rejected", "stored", "completed"]
