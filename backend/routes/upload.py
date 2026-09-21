import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException,Form
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


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):

    # Check user ID
    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID is required"
        )

    # Allowed file types
    allowed_types = [
        "image/jpeg",
        "image/png",
        "application/pdf"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG and PNG files are allowed"
        )

    # Read file
    file_data = await file.read()

    # Generate unique filename
    file_extension = file.filename.split(".")[-1]

    unique_name = f"{uuid.uuid4()}.{file_extension}"

    storage_path = f"uploads/{unique_name}"

    # Upload to Supabase Storage
    supabase.storage \
        .from_("documents") \
        .upload(
            storage_path,
            file_data,
            {
                "content-type": file.content_type
            }
        )

    # Save document information in database
    document = supabase.table("documents").insert({
        "file_name": file.filename,
        "status": "uploaded",
        "user_id": user_id
    }).execute()

    return {
        "message": "Document uploaded successfully",
        "file_name": file.filename,
        "document": document.data
    }