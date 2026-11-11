from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, index=True, nullable=False)
    village = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="farmer")


class Storage(Base):
    __tablename__ = "storages"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    type = Column(String(50))  # cold_storage / warehouse / private
    district = Column(String(100), index=True)
    state = Column(String(100))
    capacity_kg = Column(Float)
    available_kg = Column(Float)
    min_quantity_kg = Column(Float, default=0)  # small farmers ke liye important gap
    price_per_kg_month = Column(Float)
    other_charges = Column(Text)  # cost transparency gap
    contact_phone = Column(String(15))

    applications = relationship("Application", back_populates="storage")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    storage_id = Column(Integer, ForeignKey("storages.id"), nullable=False)
    crop = Column(String(100), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    duration_months = Column(Integer, default=1)
    status = Column(String(30), default="pending")  # pending/approved/rejected/stored/completed
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("User", back_populates="applications")
    storage = relationship("Storage", back_populates="applications")
