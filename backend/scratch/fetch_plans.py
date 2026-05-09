import sys
import io
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as conn:
    result = conn.execute(text("SELECT plan_name, monthly_price, coverage_description FROM protection_plans WHERE status = 'active' ORDER BY monthly_price"))
    for row in result:
        print(f"Plan: {row.plan_name} | Price: {row.monthly_price} | Desc: {row.coverage_description}")
