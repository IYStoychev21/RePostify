import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os

load_dotenv()
conn = psycopg2.connect(host="postgres", port="5432", dbname="postgres", password=os.getenv("PASSWORD"), user="postgres")
cur = conn.cursor(cursor_factory=RealDictCursor)