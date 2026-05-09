import sys
import io
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as conn:
    result = conn.execute(text("SELECT location_id, location_name, latitude, longitude FROM locations"))
    for row in result:
        print(f"ID: {row.location_id} | Name: {row.location_name} | Lat: {row.latitude} | Lon: {row.longitude}")
