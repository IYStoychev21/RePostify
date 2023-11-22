import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
conn = psycopg2.connect(host="postgres", port="5432", dbname="postgres", password=os.getenv("PASSWORD"), user="postgres")
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS organisations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        role VARCHAR(255),
        email VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS uo_bridge (
        id SERIAL PRIMARY KEY,
        uid INT REFERENCES users(id),
        oid INT REFERENCES organisations(id)
    );

    INSERT INTO users (id, name, role, email)
    VALUES 
        (DEFAULT, 'John Doe', 'Administrator', 'johndoe@gmail.com'),
        (DEFAULT, 'Jane Doe', 'PR', 'janedoe@gmail.com');

    INSERT INTO organisations (id, name)
    VALUES
        (DEFAULT, 'Org1'),
        (DEFAULT, 'Org2'),
        (DEFAULT, 'Org3');                    
""")

conn.commit()

cur.execute("""
    INSERT INTO uo_bridge (id, uid, oid)
    VALUES
        (DEFAULT, 1, 1),
        (DEFAULT, 1, 2),
        (DEFAULT, 2, 2),
        (DEFAULT, 2, 3);
""")
conn.commit()
conn.close()