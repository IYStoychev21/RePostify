import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
conn = psycopg2.connect(host="postgres", port="5432", dbname="postgres", password=os.getenv("PASSWORD"), user="postgres")
cur = conn.cursor()

cur.execute("""
            DROP TABLE IF EXISTS uo_bridge;
            DROP TABLE IF EXISTS pou_bridge;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS organisations;
            DROP TABLE IF EXISTS posts;
""")

conn.commit()
conn.close()