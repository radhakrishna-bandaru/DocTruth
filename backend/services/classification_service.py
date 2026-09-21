def classify_document(text):
    text_lower = text.lower()

    if (
        "aadhaar" in text_lower
        or "unique identification authority" in text_lower
        or "government of india" in text_lower
    ):
        return "Aadhaar"

    elif (
        "income tax" in text_lower
        or "permanent account number" in text_lower
        or "income tax department" in text_lower
    ):
        return "PAN"

    elif (
        "infosys" in text_lower
        and (
            "springboard" in text_lower
            or "intern" in text_lower
            or "internship" in text_lower
        )
    ):
        return "Internship Certificate"

    elif (
        "marksheet" in text_lower
        or "mark sheet" in text_lower
        or "academic transcript" in text_lower
    ):
        return "Marksheet"

    elif (
        "invoice" in text_lower
        or "invoice number" in text_lower
        or "bill to" in text_lower
    ):
        return "Invoice"

    elif (
        "project brief" in text_lower
        or "project report" in text_lower
        or "project concept note" in text_lower
        or "application requirements" in text_lower
        or "evaluation criteria" in text_lower
    ):
        return "Project Document"

    elif (
        "certificate" in text_lower
        or "certify" in text_lower
        or "certification" in text_lower
    ):
        return "Certificate"

    else:
        return "Unknown"