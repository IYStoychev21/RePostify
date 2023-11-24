from typing import List, Union
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import HTMLResponse
from jose import jwt
import requests
import json
import db as db
import init_db as init_db
import drop as drop
import os
from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    SessionMiddleware, secret_key=os.getenv("SECRET_KEY")
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

drop.drop_db()
init_db.init_db()

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    db.cur.execute(f"""
                        SELECT * FROM posts WHERE id = {post_id}           
    """)
    return db.cur.fetchone()["name"]


@app.get("/posts")
def get_posts():
    db.cur.execute(f"""
                        SELECT * FROM posts 
    """)
    return db.cur.fetchall()


@app.get("/user/organisations/{user_id}")
def get_user_organisations(user_id: int):
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE uid = {user_id}""")
    rows = db.cur.fetchall()
    return rows or None    


@app.get("/organisation/{organisation_id}")
def get_organisation(organisation_id: int):
    db.cur.execute(f"""SELECT * FROM organisations WHERE id = {organisation_id}""")
    return db.cur.fetchone()

@app.post("/organisation/create")
async def create_organisation(request: Request):
    #############################################
    # {                                         #
    #     name: "random-org",                   #
    #     owner: "ivan.stoychev10@gmail.com",   #
    #     members: [                            #
    #         {                                 #
    #         email: randomMail@gmail.com,      #
    #         role: "user"                      #
    #         }                                 #
    #     ]                                     #
    # }                                         #
    #############################################
    data = await request.json()
    
    db.cur.execute(f"""INSERT INTO organisations (id, name)
                        VALUES           
                            (DEFAULT, '{data["name"]}') 
    """)
    
    for member in data["members"]:
        db.cur.execute(f"""SELECT * FROM users WHERE email = '{member["email"]}'""")
        member_db = db.cur.fetchone()
        
        if member_db is None:
            db.cur.execute(f"""INSERT INTO users (id, email)
                        VALUES           
                            (DEFAULT, '{member["email"]}')
            """)
        
        db.cur.execute(f"""INSERT INTO uo_bridge (id, uid, oid, role)
                        VALUES           
                            (DEFAULT, (SELECT id FROM users WHERE email = '{member["email"]}'), (SELECT id FROM organisations WHERE name = '{data["name"]}'), '{member["role"]}');
        """)


def get_current_token(request: Request):
    token = request.session.get("access_token")
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token


@app.get("/token")
async def get_token(token: str = Depends(get_current_token)):
    return {"access_token": token}


@app.get("/user")
async def get_user(request: Request, token: str = Depends(get_current_token)):
    db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {request.session.get('access_token')}"}).json()["email"]}')""")
    user_info = db.cur.fetchone()

    if user_info is None:
        return {"detail": "User not found"}

    user_info["pfp"] = user_info["pfp"][0:-4] + "320-c"

    return user_info


@app.get("/signout")
async def sign_out(request: Request):
    request.session.pop("access_token", None)
    return {"detail": "Successfully signed out"}


@app.get("/login/google")
async def login_google():
    load_dotenv()

    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={os.getenv("GOOGLE_CLIENT_ID")}&redirect_uri={os.getenv("GOOGLE_REDIRECT_URI")}&scope=openid%20profile%20email&access_type=offline"
    }


@app.get("/auth/google", response_class=HTMLResponse)
async def auth_google(code: str, request: Request) -> HTMLResponse:
    token_url = "https://accounts.google.com/o/oauth2/token"
    data = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    request.session["access_token"] = access_token


    response = requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {request.session.get("access_token")}"}).json()
    print(f"\n\nresponse = {response}\n\n")
    db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{response["email"]}')""")
    email = db.cur.fetchone()
    
    if email is None:
        db.cur.execute(f"""INSERT INTO users (id, name, email, pfp)
                        VALUES
                            (DEFAULT, '{response["name"]}', '{response["email"]}', '{response["picture"]}');
        """)
        db.conn.commit()
        
    else:
        name = db.cur.execute(f"""SELECT name FROM users WHERE lower(name) = lower('{response["name"]}')""")
        
        if name is None:
            db.cur.execute(f"""
                           UPDATE users SET name = '{response["name"]}' WHERE lower(email) = lower('{response["email"]}'); 
                           UPDATE users SET pfp = '{response["picture"]}' WHERE lower(email) = lower('{response["email"]}')
            """)
            db.conn.commit()
    
    html_content = """
        <!DOCTYPE html>
        <html>
            <body>
                <script>
                    window.location.href = "http://localhost:5173/organizations";
                </script>
            </body>
        </html>        
    """

    return HTMLResponse(content=html_content, status_code=200)