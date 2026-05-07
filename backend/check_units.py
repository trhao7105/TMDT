"""Check current storage units data - Extremely Safe"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    load_dotenv("D:/TMDT/database/.env")
    DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, connect_args={"keepalives": 1, "connect_timeout": 10})

with engine.connect() as conn:
    print("=== LOCATIONS ===")
    rows = conn.execute(text("SELECT location_id FROM locations ORDER BY location_id")).fetchall()
    for r in rows:
        print(f"  ID: {r[0]}")

    print("\n=== STORAGE SIZES ===")
    rows = conn.execute(text("""
        SELECT ss.size_id, ss.size_code
        FROM storage_sizes ss
        WHERE ss.status = 'active'
        ORDER BY ss.size_id
    """)).fetchall()
    for r in rows:
        print(f"  ID: {r[0]}, Code: {r[1]}")

    print("\n=== CURRENT STORAGE UNITS PER SIZE ===")
    rows = conn.execute(text("""
        SELECT ss.size_id, ss.size_code, su.status, COUNT(*) as cnt
        FROM storage_units su
        JOIN storage_sizes ss ON su.size_id = ss.size_id
        GROUP BY ss.size_id, ss.size_code, su.status
        ORDER BY ss.size_id, su.status
    """)).fetchall()
    for r in rows:
        print(f"  SizeID: {r[0]}, Code: {r[1]}, Status: {r[2]}, Count: {r[3]}")

    total = conn.execute(text("SELECT COUNT(*) FROM storage_units")).scalar()
    available = conn.execute(text("SELECT COUNT(*) FROM storage_units WHERE status='available'")).scalar()
    print(f"\n  Total units: {total} | Available: {available}")
