import sys
import io
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as conn:
    result = conn.execute(text("SELECT duration_id, duration_name, duration_months, multiplier FROM duration_options WHERE status = 'active'"))
    for row in result:
        print(f"ID: {row.duration_id} | Name: {row.duration_name} | Months: {row.duration_months} | Multiplier: {row.multiplier}")
