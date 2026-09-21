from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

router = APIRouter()


# =========================
# REGISTER
# =========================

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str = ""


@router.post("/register")
def register_user(data: RegisterRequest):

    try:
        response = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True
        })

        user = response.user

        if not user:
            raise HTTPException(
                status_code=400,
                detail="User registration failed"
            )

        supabase.table("profiles").insert({
            "id": user.id,
            "full_name": data.full_name,
            "phone": data.phone
        }).execute()

        return {
            "success": True,
            "message": "Registration successful",
            "user_id": user.id,
            "email": user.email
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# =========================
# LOGIN
# =========================

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login_user(data: LoginRequest):

    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        if not response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "success": True,
            "message": "Login successful",
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )