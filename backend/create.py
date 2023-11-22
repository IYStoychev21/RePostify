import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
conn = psycopg2.connect(host="postgres", port="5432", dbname="postgres", password=os.getenv("PASSWORD"), user="postgres")
cur = conn.cursor()

cur.execute("""
                CREATE TABLE IF NOT EXISTS posts (
                    id SERIAL PRIMARY KEY,
                    body VARCHAR(2000)
                );
                
                CREATE TABLE IF NOT EXISTS pou_bridge (
                    id SERIAL PRIMARY KEY,
                    pid INT NOT NULL,
                    oid INT NOT NULL,
                    opid INT NOT NULL,
                    FOREIGN KEY (pid) REFERENCES posts (id),
                    FOREIGN KEY (oid) REFERENCES organisations (id),
                    FOREIGN KEY (opid) REFERENCES users (id)
                );
                
                CREATE TABLE IF NOT EXISTS uo_bridge (
                    id SERIAL PRIMARY KEY,
                    uid INT NOT NULL,
                    oid INT NOT NULL,
                    FOREIGN KEY (uid) REFERENCES users(id),
                    FOREIGN KEY (oid) REFERENCES organisations(id)
                );
""")

conn.commit()
conn.close()