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
        email VARCHAR(255),
        pfp VARCHAR(255)
    );

    INSERT INTO users (id, name, email)
    VALUES 
        (DEFAULT, 'John Doe', 'johndoe@gmail.com'),
        (DEFAULT, 'Jane Doe', 'janedoe@gmail.com');

    INSERT INTO organisations (id, name)
    VALUES
        (DEFAULT, 'Org1'),
        (DEFAULT, 'Org2'),
        (DEFAULT, 'Org3');    
        
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
        FOREIGN KEY (oid) REFERENCES organisations(id),
        role VARCHAR(255) NOT NULL
    );                
    
    INSERT INTO uo_bridge (id, uid, oid, role)
    VALUES
        (DEFAULT, 1, 1, 'Administrator'),
        (DEFAULT, 1, 2, 'Administrator'),
        (DEFAULT, 2, 2, 'Member'),
        (DEFAULT, 2, 3, 'Member');
""")

conn.commit()
conn.close()