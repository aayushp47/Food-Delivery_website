import getpass

import models
from auth_security import hash_password
from database import SessionLocal


def reset_staff_password():
    email = input("Account email to reset: ").strip().lower()
    password = getpass.getpass("Temporary password (at least 8 characters): ")
    confirmation = getpass.getpass("Confirm temporary password: ")

    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters.")
    if password != confirmation:
        raise SystemExit("Passwords do not match.")

    db = SessionLocal()
    try:
        staff = db.query(models.StaffUser).filter(
            models.StaffUser.email == email
        ).first()
        if staff is None:
            raise SystemExit("No account found with that email.")

        staff.password_hash = hash_password(password)
        staff.must_change_password = True
        db.commit()
        print(f"Password reset for {staff.email}; they must change it at next sign-in.")
    finally:
        db.close()


if __name__ == "__main__":
    reset_staff_password()