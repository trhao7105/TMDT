"""Seed more storage units to increase capacity - Final Fix"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv("D:/TMDT/database/.env")
DATABASE_URL = os.getenv("DATABASE_URL")

if "sslmode=verify-full" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("sslmode=verify-full", "sslmode=require")

engine = create_engine(DATABASE_URL, connect_args={"keepalives": 1, "connect_timeout": 30})

def seed():
    print("Fetching metadata...", flush=True)
    try:
        with engine.connect() as conn:
            sizes = conn.execute(text("SELECT size_id, size_code FROM storage_sizes WHERE status = 'active'")).fetchall()
            locations = conn.execute(text("SELECT location_id FROM locations")).fetchall()
            print(f"Found {len(sizes)} sizes and {len(locations)} locations.", flush=True)
            
            if not sizes or not locations:
                return

            total_added = 0
            for loc in locations:
                loc_id = loc[0]
                print(f"Processing Location {loc_id}...", flush=True)
                
                # Manual transaction control for maximum compatibility
                for size in sizes:
                    size_id = size[0]
                    size_code = size[1]
                    
                    for i in range(1, 11):
                        unit_num = i + 300 # Even newer offset
                        unit_code = f"U-{size_code}-{loc_id}-{unit_num}"
                        
                        conn.execute(text("""
                            INSERT INTO storage_units (location_id, size_id, unit_code, status)
                            VALUES (:l, :s, :c, 'available')
                        """), {"l": loc_id, "s": size_id, "c": unit_code})
                        total_added += 1
                
                # Commit using text command if needed or just let it auto-commit if in that mode
                conn.execute(text("COMMIT"))
                print(f"  Location {loc_id} done.", flush=True)
            
            print(f"\nSuccessfully added {total_added} new units.", flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)

if __name__ == "__main__":
    seed()
