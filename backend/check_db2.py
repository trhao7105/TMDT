import os
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql+psycopg2://neondb_owner:npg_9Kw5ryJzZjme@ep-morning-math-aozy7794-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"))
    for row in result:
        print(row)
