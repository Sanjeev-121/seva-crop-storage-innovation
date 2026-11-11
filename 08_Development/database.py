import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL ke liye: postgresql+psycopg2://user:password@localhost:5432/seva_storage
# Abhi testing ke liye default SQLite hai, taaki bina Postgres ke bhi chal jaye.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./seva.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()