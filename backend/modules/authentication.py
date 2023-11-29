import code
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
import requests
from modules.get_token import get_current_token
import modules.db as db

router = APIRouter()

@router.get("/token", tags=["Authentication"])
async def get_token(token: str = Depends(get_current_token)):
    return {"access_token": token}


@router.get("/login/google", tags=["Authentication"])
async def login_google():
    load_dotenv()

    return {    
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={os.getenv('GOOGLE_CLIENT_ID')}&redirect_uri={os.getenv('GOOGLE_REDIRECT_URI')}&scope=openid%20profile%20email&access_type=offline"
    }


@router.get("/auth/google", response_class=RedirectResponse, tags=["Authentication"])
async def auth_google(code: str, request: Request) -> RedirectResponse:
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


    response = requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {request.session.get('access_token')}"}).json()
    
    request.session["email"] = response["email"]
    
    db.cur.execute(f"""SELECT * FROM users WHERE lower(email) = lower('{response['email']}')""")
    email = db.cur.fetchone()
    
    if email is None:
        db.cur.execute(f"""INSERT INTO users (id, name, email, pfp)
                        VALUES
                            (DEFAULT, '{response['name']}', '{response['email']}', '{response['picture']}');
        """)
        db.conn.commit()
        
    else:
        name = db.cur.execute(f"""SELECT name FROM users WHERE lower(name) = lower('{response['name']}')""")
        
        if name is None:
            db.cur.execute(f"""
                        UPDATE users SET name = '{response['name']}' WHERE lower(email) = lower('{response['email']}'); 
                        UPDATE users SET pfp = '{response['picture']}' WHERE lower(email) = lower('{response['email']}')
            """)
            db.conn.commit()

    return RedirectResponse(url="http://localhost:5173/organizations")


@router.get("/login/facebook", response_class=RedirectResponse, tags=["Authentication"])
async def login_facebook(request: Request):
    load_dotenv()
    return RedirectResponse(f"""https://www.facebook.com/v18.0/dialog/oauth?client_id={os.getenv('FACEBOOK_APP_ID')}&redirect_uri={os.getenv('FACEBOOK_REDIRECT_URI')}&state={os.getenv('SECRET_KEY')}&scope=pages_manage_posts,pages_read_engagement""")
    
    
@router.get("/auth/facebook", response_class=RedirectResponse, tags=["Authentication"])
async def auth_facebook(code: str, request: Request) -> RedirectResponse:
    token_url = "https://graph.facebook.com/oauth/access_token"
    print(f"app secret: {os.getenv("FACEBOOK_APP_SECRET")}")
    params = {
        "client_id": os.getenv("FACEBOOK_APP_ID"),
        "redirect_uri": os.getenv("FACEBOOK_REDIRECT_URI"),
        "client_secret": "0fcd5275692c7c4e2468f44489429db8",
        "code": code
    }
    response = requests.get(token_url, params=params).json()
    print(f"response: {response}")
    access_token = response.get("access_token")
    # print(f"code: {access_token}")  # Print the access token
    # request.session["access_token"] = access_token
    print(f"access_token: {access_token}")

    pages_response = requests.get("https://graph.facebook.com/me/accounts", params={"access_token": access_token}).json()
    page_access_token = pages_response['data'][0]['access_token']  # Get the access token for the first page
    print(f"page_access_token: {page_access_token}")
    
    post_url = f"https://graph.facebook.com/{pages_response['data'][0]['id']}/feed"
    post_params = {
        "message": "Hello, world from python!",
        "access_token": page_access_token
    }
    post_response = requests.post(post_url, data=post_params)

    return RedirectResponse(url="http://localhost:5173/organizations")


@router.delete("/signout", tags=["Authentication"])
async def sign_out(request: Request):
    if (request.session.get("access_token") is None or request.session.get("email") is None):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    request.session.pop("access_token", None)
    request.session.pop("email", None)
    return {"detail": "Successfully signed out"}

#EAAFOtWkUAOsBO6gBWg9tCq3f16mSyIx3CjQWmCV0RDA3gFdATuwI86IEQLG7ZBNpj4wT8luOkQt1BClKLKjJPZAAmnO8KD30fmcWhNIcCddEZBZAGZCTJg43UoqlyBZBoTS540ZAnt4p2MGvTqVJZAmgHYGVaRiBZAZARusLoBXbbQFxRWcdr1qDgE9avf6WFNSg5PYgciJU6MBes26tmZA8ahHTU8ZD
#198288730024405