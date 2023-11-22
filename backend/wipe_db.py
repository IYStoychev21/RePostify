import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
conn = psycopg2.connect(host="postgres", port="5432", dbname="postgres", password=os.getenv("PASSWORD"), user="postgres")
cur = conn.cursor()

cur.execute("""
    DELETE FROM uo_bridge;
    DELETE FROM users;
    DELETE FROM organisations;
""")

conn.commit();
conn.close();