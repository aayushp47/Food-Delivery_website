import os
import re
from pathlib import Path
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


BASE_DIR = Path(__file__).resolve().parent


def load_env_file(path):
    if not path.exists():
        return

    with path.open("r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


load_env_file(BASE_DIR / ".env")

mysql_host = os.getenv("MYSQL_HOST")
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_database = os.getenv("MYSQL_DATABASE", "foodhive")

if mysql_host and mysql_password:
    mysql_user = os.getenv("MYSQL_USER", "root")
    mysql_port = os.getenv("MYSQL_PORT", "3306")
    DATABASE_URL = (
        f"mysql+pymysql://{quote_plus(mysql_user)}:{quote_plus(mysql_password)}"
        f"@{mysql_host}:{mysql_port}/{mysql_database}"
    )
else:
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Render may provide PostgreSQL URLs with the legacy ``postgres://`` scheme.
    # SQLAlchemy expects ``postgresql://`` (and psycopg2 is installed from requirements).
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]

    if DATABASE_URL and re.match(r"^sqlite:////[A-Za-z]:/", DATABASE_URL):
        DATABASE_URL = "sqlite:///" + DATABASE_URL[len("sqlite:////"):]

    if not DATABASE_URL:
        sqlite_path = (BASE_DIR / "foodhive.db").resolve()
        DATABASE_URL = f"sqlite:///{sqlite_path.as_posix()}"


engine_options = {
    "echo": False
}

if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}


engine = create_engine(DATABASE_URL, **engine_options)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
