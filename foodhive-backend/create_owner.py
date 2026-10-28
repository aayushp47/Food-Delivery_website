import getpass
import re

import models
from auth_security import hash_password
from database import Base
from database import SessionLocal
from database import engine


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def create_initial_owner():

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(models.StaffUser).filter(
            models.StaffUser.role == "owner",
            models.StaffUser.is_active.is_(True)
        ).first():
            raise SystemExit("An active owner already exists.")

        name = input("Owner name: ").strip()
        email = input("Owner email: ").strip().lower()
        if not name or not EMAIL_PATTERN.fullmatch(email):
            raise SystemExit("Enter a name and a valid email address.")

        password = getpass.getpass("Owner password (minimum 8 characters): ")
        confirmation = getpass.getpass("Confirm owner password: ")
        if len(password) < 8:
            raise SystemExit("Password must contain at least 8 characters.")
        if password != confirmation:
            raise SystemExit("Passwords do not match.")

        if db.query(models.StaffUser).filter(
            models.StaffUser.email == email
        ).first():
            raise SystemExit("An account with this email already exists.")

        db.add(models.StaffUser(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role="owner",
            is_active=True,
            must_change_password=False
        ))
        db.commit()
        print(f"Owner account created for {email}.")
    finally:
        db.close()


if __name__ == "__main__":
    create_initial_owner()