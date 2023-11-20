from typing import List, Union
from fastapi import FastAPI
from Post import Post
from dotenv import load_dotenv
import os
import psycopg2
import json


load_dotenv()
conn = psycopg2.connect(host="postgres", port="5432", dbname="postgres", password=os.getenv("PASSWORD"), user="postgres")
cur = conn.cursor()

# create table if it doesn't exist
cur.execute("""
            CREATE TABLE IF NOT EXISTS post (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255)
            )
""")

# insert testing values into table
cur.execute("""
            INSERT INTO post (id, name) VALUES
            (DEFAULT, 'post 0'),
            (DEFAULT, 'post 1'),
            (DEFAULT, 'post 2')
""")

conn.commit()


app = FastAPI()

# create a list of posts
posts: List[Post] = []

# append 10 new posts to the list
for i in range(10):
     post: Post = Post(f"post {i}", i)
     posts.append(post)

# write an api get at url /posts/{post_id} and make it return a post object's name
@app.get("/posts/{post_id}")
def get_post(post_id: int):
    cur.execute(f"""
                        SELECT * FROM post WHERE id = {post_id}           
    """)
    return cur.fetchone()[1]

# write an api get at url /posts
@app.get("/posts")
def get_posts():
    return posts

@app.get("/")
def root():
    return {"message": "Hello World"}