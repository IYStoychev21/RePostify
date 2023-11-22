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
    
    ALTER SEQUENCE uo_bridge_id_seq RESTART WITH 1;
    ALTER SEQUENCE users_id_seq RESTART WITH 1;
    ALTER SEQUENCE organisations_id_seq RESTART WITH 1;
""")

conn.commit();
conn.close();