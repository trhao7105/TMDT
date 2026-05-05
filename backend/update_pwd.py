import os
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get("DATABASE_URL")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash("123456")

engine = create_engine(db_url)
with engine.connect() as conn:
    conn.execute(text("UPDATE users SET password_hash = :hash WHERE email = 'an.customer@example.com'"), {"hash": hashed})
    conn.commit()
    print("Password updated for an.customer@example.com")
