"""Sample data daalne ke liye: python seed.py

NOTE: ye sirf demo/testing ka SAMPLE data hai, asli storage facilities ka data nahi.
Asli data Member 5 (database) research ke baad POST /storages se daalega.
"""
from database import Base, engine, SessionLocal
import models
import auth

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if not db.query(models.User).filter(models.User.phone == "9000000000").first():
    db.add(
        models.User(
            name="Demo Operator",
            phone="9000000000",
            role="operator",
            district="Ranchi",
            state="Jharkhand",
            password_hash=auth.hash_password("operator123"),
        )
    )

if db.query(models.Storage).count() == 0:
    samples = [
        dict(name="Sample Cold Storage A", type="cold_storage", district="Ranchi",
             state="Jharkhand", capacity_kg=50000, available_kg=20000,
             min_quantity_kg=50, price_per_kg_month=2.5, other_charges="Loading Rs 1/kg"),
        dict(name="Sample Warehouse B", type="warehouse", district="Hazaribagh",
             state="Jharkhand", capacity_kg=100000, available_kg=60000,
             min_quantity_kg=100, price_per_kg_month=1.2, other_charges="None"),
        dict(name="Sample Cold Storage C", type="cold_storage", district="Patna",
             state="Bihar", capacity_kg=80000, available_kg=5000,
             min_quantity_kg=25, price_per_kg_month=3.0, other_charges="Insurance Rs 0.5/kg"),
    ]
    for s in samples:
        db.add(models.Storage(**s))

db.commit()
db.close()
print("Seed done. Operator login: phone 9000000000, password operator123")
