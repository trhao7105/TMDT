from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

durations = [
    ("Thuê 1 ngày", 1/30, 0.05, 'active'),
    ("Thuê 3 ngày", 3/30, 0.12, 'active'),
    ("Thuê 7 ngày (1 tuần)", 7/30, 0.25, 'active'),
    ("Thuê 1 tháng", 1.0, 1.0, 'active'),
    ("Thuê 3 tháng", 3.0, 2.8, 'active'),
    ("Thuê 6 tháng", 6.0, 5.4, 'active'),
    ("Thuê 12 tháng", 12.0, 10.0, 'active')
]

with engine.connect() as conn:
    # Clear existing if needed or just update
    conn.execute(text("UPDATE duration_options SET status = 'inactive'"))
    for name, months, mult, status in durations:
        conn.execute(text("""
            INSERT INTO duration_options (duration_name, duration_months, multiplier, status)
            VALUES (:name, :months, :mult, :status)
            ON CONFLICT (duration_name) DO UPDATE 
            SET duration_months = EXCLUDED.duration_months,
                multiplier = EXCLUDED.multiplier,
                status = EXCLUDED.status
        """), {"name": name, "months": months, "mult": mult, "status": status})
    conn.commit()
    print("Updated duration options with daily and monthly plans.")
