from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import tempfile

from services.classification_service import classify_document
from services.field_extraction_service import extract_fields
from services.verification_service import run_verification

from dotenv import load_dotenv
from supabase import create_client

from services.ocr_service import (
    extract_text_from_image,
    extract_text_from_pdf
)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

router = APIRouter()


@router.post("/ocr/{document_id}")
async def ocr_document(
    document_id: str,
    file: UploadFile = File(...)
):

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

    file_data = await file.read()

    extension = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "application/pdf": ".pdf"
    }[file.content_type]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=extension
    ) as temp:

        temp.write(file_data)
        temp_path = temp.name

    try:

        # OCR
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(temp_path)
        else:
            text = extract_text_from_image(temp_path)

        # Document classification
        document_type = classify_document(text)

        # Field extraction
        fields = extract_fields(text)

        # Verification
        verification_results = run_verification(
            document_type,
            fields
        )

        # Decide final document status
        has_failed = any(
            result["status"] == "failed"
            for result in verification_results
        )

        has_warning = any(
            result["status"] == "warning"
            for result in verification_results
        )

        if has_failed or has_warning:
            final_status = "suspicious"
        else:
            final_status = "verified"

        # Update document
        supabase.table("documents").update({
            "document_type": document_type,
            "status": final_status
        }).eq(
            "id",
            document_id
        ).execute()

        # Save full OCR text
        supabase.table("extracted_data").insert({
            "document_id": document_id,
            "field_name": "full_text",
            "field_value": text
        }).execute()

        # Save extracted fields
        for field_name, field_value in fields.items():

            supabase.table("extracted_data").insert({
                "document_id": document_id,
                "field_name": field_name,
                "field_value": field_value
            }).execute()

        # Save verification results
        for result in verification_results:

            supabase.table("verification_results").insert({
                "document_id": document_id,
                "check_name": result["check_name"],
                "status": result["status"],
                "reason": result["reason"]
            }).execute()

        print("DOCUMENT TYPE:", document_type)
        print("EXTRACTED FIELDS:", fields)
        print("FINAL STATUS:", final_status)
        return {
    "success": True,
    "document_id": document_id,
    "file_name": file.filename,
    "document_type": document_type,
    "status": final_status,
    "fields": fields,
    "text": text,
    "verification_results": verification_results
}

    finally:
        os.remove(temp_path)