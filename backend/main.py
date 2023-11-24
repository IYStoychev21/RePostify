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


def get_current_token(request: Request):
    token = request.session.get("access_token")
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token


@app.get("/posts/{post_id}", tags=["Posts"])
async def get_post(post_id: int):
    db.cur.execute(f"""
                        SELECT * FROM posts WHERE id = {post_id}           
    """)
    return db.cur.fetchone()["name"]


@app.get("/posts", tags=["Posts"])
async def get_posts():
    db.cur.execute(f"""
                        SELECT * FROM posts 
    """)
    return db.cur.fetchall()


@app.get("/organisation/posts/{organisation_id}", tags=["Posts"])
async def get_organisation_posts(organisation_id: int):
    db.cur.execute(f"""SELECT * FROM pou_bridge WHERE oid = {organisation_id}""")
    return db.cur.fetchall()


@app.get("/user/posts/{user_id}", tags=["Posts"])
async def get_user_posts(user_id: int):
    db.cur.execute(f"""SELECT * FROM pou_bridge WHERE uid = {user_id}""")
    return db.cur.fetchall()


@app.post("/post/create", tags=["Posts"])
async def create_post(request: Request):
    data = await request.json()
    db.cur.execute(f"""INSERT INTO posts (id, body)
                        VALUES           
                            (DEFAULT, '{data["body"]}');
    """)
    db.conn.commit()
    
    
@app.delete("/post/delete/{post_id}", tags=["Posts"])
async def delete_post(post_id: int):
    db.cur.execute(f"""DELETE FROM posts WHERE id = {post_id}""")
    db.conn.commit()


@app.get("/user/organisations/{user_id}", tags=["Users"])
def get_user_organisations(user_id: int):
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE uid = {user_id}""")
    rows = db.cur.fetchall()
    return rows or None    


@app.get("/user", tags=["Users"])
async def get_user_info(request: Request, token: str = Depends(get_current_token)):
    db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{request.session.get("email")}')""")
    user_info = db.cur.fetchone()

    if user_info is None:
        return {"detail": "User not found"}

    user_info["pfp"] = user_info["pfp"][0:-4] + "320-c"

    return user_info


@app.delete("/user/organisation/{organisation_id}", tags=["Users"])
async def leave_organisation(request: Request, organisation_id: int):
    if not "email" in request.session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db.cur.execute(f"""SELECT * FROM uo_bridge WHERE lower(email) = lower('{request.session.get("email")}')""")
    user_role = db.cur.fetchone()["role"]
    
    if (user_role == "owner"):
        raise HTTPException(status_code=401, detail="Cannot leave organisation as owner")
    
    db.cur.execute(f"""DELETE FROM uo_bridge WHERE uid = (SELECT id FROM users WHERE lower(email) = lower('{request.session.get("email")}')) AND oid = {organisation_id}""")
    db.conn.commit()


@app.get("/organisation/{organisation_id}", tags=["Organisations"])
async def get_organisation(organisation_id: int):
    db.cur.execute(f"""SELECT * FROM organisations WHERE id = {organisation_id}""")
    return db.cur.fetchone()


@app.post("/organisation/create", tags=["Organisations"])
async def create_organisation(request: Request):
    #############################################
    # {                                         #
    #     name: "random-org",                   #
    #     owner: "owner@gmail.com",             #
    #     members: [                            #
    #         {                                 #
    #           email: member@gmail.com,        #
    #           role: "user"                    #
    #         }                                 #
    #     ]                                     #
    # }                                         #
    #############################################
    data = await request.json()
    if (not "name" in data or not "owner" in data or not "members" in data):
        raise HTTPException(status_code=400, detail="Invalid data")
    
    db.cur.execute(f"""SELECT * FROM organisations WHERE lower(name) = lower('{data["name"]}')""")
    organisation = db.cur.fetchone()
    if (organisation is not None):
        raise HTTPException(status_code=400, detail="Organisation already exists")
    
    db.cur.execute(f"""INSERT INTO organisations (id, name)
                        VALUES           
                            (DEFAULT, '{data["name"]}');
    """)
    
    db.cur.execute(f"""INSERT INTO uo_bridge (id, uid, oid, role)
                        VALUES           
                            (DEFAULT, (SELECT id FROM users WHERE email = '{data["owner"]}'), (SELECT id FROM organisations WHERE name = '{data["name"]}'), 'owner');
    """)
    
    for member in data["members"]:
        db.cur.execute(f"""SELECT * FROM users WHERE email = '{member["email"]}'""");
        member_db = db.cur.fetchone()
        
        if member_db is None:
            db.cur.execute(f"""INSERT INTO users (id, email)
                        VALUES           
                            (DEFAULT, '{member["email"]}');
            """)
        
        db.cur.execute(f"""INSERT INTO uo_bridge (id, uid, oid, role)
                        VALUES           
                            (DEFAULT, (SELECT id FROM users WHERE email = '{member["email"]}'),
                            (SELECT id FROM organisations WHERE name = '{data["name"]}'), '{member["role"]}');
        """)
    
    db.conn.commit()


@app.get("/token", tags=["Authentication"])
async def get_token(token: str = Depends(get_current_token)):
    
    secret_key = os.getenv("SECRET_KEY")
    try:
        jwt.decode(token, secret_key, algorithms=["HS256"])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token is expired")
    print(f"\n\nToken = {token}\n\n")
    return token


@app.get("/login/google", tags=["Authentication"])
async def login_google():
    load_dotenv()

    return {    
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={os.getenv("GOOGLE_CLIENT_ID")}&redirect_uri={os.getenv("GOOGLE_REDIRECT_URI")}&scope=openid%20profile%20email&access_type=offline"
    }


@app.get("/auth/google", response_class=HTMLResponse, tags=["Authentication"])
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
    request.session["email"] = response["email"]
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


@app.delete("/signout", tags=["Authentication"])
async def sign_out(request: Request):
    request.session.pop("access_token", None)
    return {"detail": "Successfully signed out"}