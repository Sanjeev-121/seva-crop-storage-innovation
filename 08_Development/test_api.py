import os

# Test ke liye alag database, taaki asli seva.db kharab na ho
os.environ["DATABASE_URL"] = "sqlite:///./test_seva.db"

import pytest
from fastapi.testclient import TestClient

from database import Base, engine
from main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def fresh_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


def register(phone, role="farmer"):
    r = client.post(
        "/auth/register",
        json={"name": "Test", "phone": phone, "password": "secret123", "role": role},
    )
    assert r.status_code == 201, r.text
    t = client.post("/auth/login", json={"phone": phone, "password": "secret123"})
    assert t.status_code == 200, t.text
    return {"Authorization": f"Bearer {t.json()['access_token']}"}


def make_storage(op_headers, available=1000, minimum=10):
    r = client.post(
        "/storages",
        headers=op_headers,
        json={"name": "S1", "district": "Ranchi", "available_kg": available,
              "min_quantity_kg": minimum},
    )
    assert r.status_code == 201, r.text
    return r.json()["id"]


def test_register_and_duplicate():
    register("9876543210")
    r = client.post(
        "/auth/register",
        json={"name": "X", "phone": "9876543210", "password": "secret123"},
    )
    assert r.status_code == 400


def test_login_wrong_password():
    register("9876543210")
    r = client.post("/auth/login", json={"phone": "9876543210", "password": "wrong"})
    assert r.status_code == 401


def test_me_requires_token():
    assert client.get("/me").status_code == 401


def test_farmer_cannot_add_storage():
    farmer = register("9876543210")
    r = client.post("/storages", headers=farmer, json={"name": "S"})
    assert r.status_code == 403


def test_application_flow_and_capacity():
    op = register("9000000000", role="operator")
    farmer = register("9876543210")
    sid = make_storage(op, available=1000)

    r = client.post(
        "/applications", headers=farmer,
        json={"storage_id": sid, "crop": "potato", "quantity_kg": 200, "duration_months": 3},
    )
    assert r.status_code == 201
    app_id = r.json()["id"]
    assert r.json()["status"] == "pending"
    assert len(r.json()["events"]) == 1

    # farmer status nahi badal sakta
    r = client.patch(f"/applications/{app_id}/status", headers=farmer, json={"status": "approved"})
    assert r.status_code == 403

    # operator approve karta hai -> capacity ghatti
    r = client.patch(f"/applications/{app_id}/status", headers=op, json={"status": "approved"})
    assert r.status_code == 200
    assert len(r.json()["events"]) == 2
    assert client.get(f"/storages/{sid}").json()["available_kg"] == 800

    # farmer cancel karta hai -> capacity wapas
    r = client.patch(f"/applications/{app_id}/cancel", headers=farmer)
    assert r.status_code == 200
    assert r.json()["status"] == "cancelled"
    assert client.get(f"/storages/{sid}").json()["available_kg"] == 1000


def test_quantity_rules():
    op = register("9000000000", role="operator")
    farmer = register("9876543210")
    sid = make_storage(op, available=100, minimum=50)

    too_small = client.post(
        "/applications", headers=farmer,
        json={"storage_id": sid, "crop": "rice", "quantity_kg": 10},
    )
    assert too_small.status_code == 400

    too_big = client.post(
        "/applications", headers=farmer,
        json={"storage_id": sid, "crop": "rice", "quantity_kg": 500},
    )
    assert too_big.status_code == 400


def test_farmer_cannot_see_others_application():
    op = register("9000000000", role="operator")
    f1 = register("9876543210")
    f2 = register("9123456780")
    sid = make_storage(op)
    app_id = client.post(
        "/applications", headers=f1,
        json={"storage_id": sid, "crop": "wheat", "quantity_kg": 50},
    ).json()["id"]
    assert client.get(f"/applications/{app_id}", headers=f2).status_code == 404
    assert client.get(f"/applications/{app_id}", headers=f1).status_code == 200
