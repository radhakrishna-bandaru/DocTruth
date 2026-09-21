def run_verification(document_type, fields):
    results = []

    # Document type check
    if document_type == "Unknown":
        results.append({
            "check_name": "Document Type",
            "status": "failed",
            "reason": "Document type could not be identified"
        })
    else:
        results.append({
            "check_name": "Document Type",
            "status": "passed",
            "reason": f"Identified as {document_type}"
        })

    # Name check
    if "name" in fields:
        results.append({
            "check_name": "Name",
            "status": "passed",
            "reason": "Name was extracted successfully"
        })
    else:
        results.append({
            "check_name": "Name",
            "status": "warning",
            "reason": "Name could not be extracted"
        })

    return results