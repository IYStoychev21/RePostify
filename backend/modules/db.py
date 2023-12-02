import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os

load_dotenv()
conn = psycopg2.connect(user="postgres", password=os.getenv("PASSWORD"), host="postgres", port=5432, database="postgres")
cur = conn.cursor(cursor_factory=RealDictCursor)