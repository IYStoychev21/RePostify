from fastapi import FastAPI
from modules import users, posts, organisations, authentication, init_db, drop
from starlette.middleware.sessions import SessionMiddleware
import os
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    SessionMiddleware, secret_key=os.getenv("SECRET_KEY")
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.router.include_router(users.router)
app.router.include_router(posts.router)
app.router.include_router(organisations.router)
app.router.include_router(authentication.router)

drop.drop_db()
init_db.init_db()