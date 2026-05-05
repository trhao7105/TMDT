import os
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql+psycopg2://neondb_owner:npg_9Kw5ryJzZjme@ep-morning-math-aozy7794-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    for row in result:
        print(row)
