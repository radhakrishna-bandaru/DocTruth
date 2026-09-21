import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client
from fastapi.middleware.cors import CORSMiddleware

from routes.ocr import router as ocr_router
from routes.upload import router as upload_router
from routes.auth import router as auth_router


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)


app = FastAPI()


# --------------------------------
# CORS
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# ROUTERS
# --------------------------------

app.include_router(
    upload_router,
    prefix="/api"
)

app.include_router(
    ocr_router,
    prefix="/api"
)

app.include_router(
    auth_router,
    prefix="/api/auth"
)


# --------------------------------
# ROOT
# --------------------------------

@app.get("/")
def root():
    return {
        "message": "Document Intelligence API is running"
    }


# --------------------------------
# TEST DATABASE
# --------------------------------

@app.get("/test-db")
def test_db():

    response = (
        supabase
        .table("documents")
        .select("*")
        .execute()
    )

    return {
        "success": True,
        "data": response.data
    }


# --------------------------------
# DASHBOARD
# --------------------------------

@app.get("/api/dashboard/{user_id}")
def dashboard_data(user_id: str):

    response = (
        supabase
        .table("documents")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    documents = response.data or []

    total = len(documents)

    verified = len([
        d for d in documents
        if d.get("status") == "verified"
    ])

    pending = len([
        d for d in documents
        if d.get("status") in [
            "uploaded",
            "ocr_completed"
        ]
    ])

    suspicious = len([
        d for d in documents
        if d.get("status") == "suspicious"
    ])


    # STATUS COUNTS

    status_counts = {
        "uploaded": 0,
        "ocr_completed": 0,
        "verified": 0,
        "suspicious": 0
    }


    # DOCUMENT TYPE COUNTS

    type_counts = {}


    for document in documents:

        status = document.get("status")

        if status in status_counts:
            status_counts[status] += 1


        document_type = (
            document.get("document_type")
            or "Unknown"
        )

        if document_type not in type_counts:
            type_counts[document_type] = 0

        type_counts[document_type] += 1


    return {
        "total": total,
        "verified": verified,
        "pending": pending,
        "suspicious": suspicious,
        "status_counts": status_counts,
        "type_counts": type_counts,
        "documents": documents
    }


# --------------------------------
# NOTIFICATIONS
# --------------------------------

@app.get("/api/notifications/{user_id}")
def notifications_data(user_id: str):

    documents_response = (
        supabase
        .table("documents")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    documents = documents_response.data or []

    notifications = []


    for document in documents:

        status = document.get("status")

        file_name = document.get(
            "file_name",
            "Document"
        )

        created_at = document.get(
            "created_at"
        )


        if status == "verified":

            notifications.append({
                "id": f"{document['id']}-verified",
                "title": "Document Verified",
                "message": (
                    f"{file_name} has been "
                    "successfully verified."
                ),
                "type": "success",
                "created_at": created_at
            })


        elif status == "suspicious":

            notifications.append({
                "id": f"{document['id']}-suspicious",
                "title": "Verification Alert",
                "message": (
                    f"{file_name} requires "
                    "further review."
                ),
                "type": "warning",
                "created_at": created_at
            })


        elif status in [
            "uploaded",
            "ocr_completed"
        ]:

            notifications.append({
                "id": f"{document['id']}-processing",
                "title": "Document Processing",
                "message": (
                    f"{file_name} is being processed."
                ),
                "type": "info",
                "created_at": created_at
            })


    return {
        "notifications": notifications
    }


# --------------------------------
# PROFILE
# --------------------------------

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):

    user_response = (
        supabase
        .auth.admin
        .get_user_by_id(user_id)
    )


    if not user_response.user:

        return {
            "success": False,
            "message": "User not found"
        }


    profile_response = (
        supabase
        .table("profiles")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )


    profile = profile_response.data


    return {
        "success": True,
        "profile": {
            "id": user_id,
            "email": user_response.user.email,
            "full_name": (
                profile.get("full_name", "")
                if profile
                else ""
            ),
            "phone": (
                profile.get("phone", "")
                if profile
                else ""
            )
        }
    }


# --------------------------------
# PROFILE UPDATE
# --------------------------------

class ProfileUpdate(BaseModel):

    full_name: str
    phone: str = ""


@app.put("/api/profile/{user_id}")
def update_profile(
    user_id: str,
    data: ProfileUpdate
):

    full_name = data.full_name.strip()
    phone = data.phone.strip()


    if not full_name:

        return {
            "success": False,
            "message": "Full name is required"
        }


    # Check user

    user_response = (
        supabase
        .auth.admin
        .get_user_by_id(user_id)
    )


    if not user_response.user:

        return {
            "success": False,
            "message": "User not found"
        }


    # Update profile

    response = (
        supabase
        .table("profiles")
        .update({
            "full_name": full_name,
            "phone": phone
        })
        .eq("id", user_id)
        .execute()
    )


    if not response.data:

        return {
            "success": False,
            "message": "Profile update failed"
        }


    return {
        "success": True,
        "message": "Profile updated successfully",
        "profile": {
            "id": user_id,
            "email": user_response.user.email,
            "full_name": full_name,
            "phone": phone
        }
    }


# --------------------------------
# DOCUMENT DETAILS
# --------------------------------

@app.get("/api/document/{document_id}")
def get_document_details(
    document_id: str
):

    document_response = (
        supabase
        .table("documents")
        .select("*")
        .eq("id", document_id)
        .single()
        .execute()
    )


    document = document_response.data


    if not document:

        return {
            "success": False,
            "message": "Document not found"
        }


    extracted_response = (
        supabase
        .table("extracted_data")
        .select("*")
        .eq("document_id", document_id)
        .execute()
    )


    verification_response = (
        supabase
        .table("verification_results")
        .select("*")
        .eq("document_id", document_id)
        .execute()
    )


    return {
        "success": True,
        "document": document,
        "extracted_data": (
            extracted_response.data
        ),
        "verification_results": (
            verification_response.data
        )
    }


# --------------------------------
# TEST EXTRACTED DATA
# --------------------------------

@app.get("/test-extracted")
def test_extracted():

    response = (
        supabase
        .table("extracted_data")
        .select("*")
        .execute()
    )

    return {
        "success": True,
        "data": response.data
    }


# --------------------------------
# TEST VERIFICATION
# --------------------------------

@app.get("/test-verification")
def test_verification():

    response = (
        supabase
        .table("verification_results")
        .select("*")
        .execute()
    )

    return {
        "success": True,
        "data": response.data
    }