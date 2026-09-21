import re


def clean_name(name):
    name = name.strip()

    # Remove OCR garbage at the end
    name = re.sub(
        r"\s+(wig|w1g|wigg|v1g|whig)$",
        "",
        name,
        flags=re.IGNORECASE
    )

    # Keep alphabets and spaces
    name = re.sub(r"[^A-Za-z ]", "", name)

    # Remove extra spaces
    name = re.sub(r"\s+", " ", name).strip()

    return name


def extract_fields(text):
    fields = {}

    # --------------------------------
    # NAME EXTRACTION
    # --------------------------------

    # Handle:
    # This certificate is awarded to z
    # BANDARU RADHA KRISHNA wig

    certificate_name_match = re.search(
        r"certificate\s+is\s+awarded\s+to\s+[^\n]*\n\s*([A-Za-z ]+)",
        text,
        re.IGNORECASE
    )

    if certificate_name_match:

        name = clean_name(
            certificate_name_match.group(1)
        )

        if len(name.split()) >= 2:
            fields["name"] = name

    # Explicit name field
    if "name" not in fields:

        name_match = re.search(
            r"(?:name|candidate name|student name)"
            r"\s*[:\-]\s*([A-Za-z ]+)",
            text,
            re.IGNORECASE
        )

        if name_match:

            name = clean_name(
                name_match.group(1)
            )

            if len(name.split()) >= 2:
                fields["name"] = name

    # --------------------------------
    # FALLBACK NAME
    # --------------------------------

    if "name" not in fields:

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        for line in lines:

            cleaned = clean_name(line)

            words = cleaned.split()

            if 2 <= len(words) <= 4:

                ignored = {
                    "nptel",
                    "online",
                    "certification",
                    "certificate",
                    "government",
                    "india",
                    "skill",
                    "this",
                    "course",
                    "project",
                    "brief",
                    "document",
                    "management"
                }

                if not any(
                    word.lower() in ignored
                    for word in words
                ):
                    fields["name"] = cleaned
                    break

    # --------------------------------
    # DATE
    # --------------------------------

    date_match = re.search(
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
        text
    )

    if date_match:
        fields["date"] = date_match.group(0)

    # --------------------------------
    # ROLL NUMBER
    # --------------------------------

    roll_match = re.search(
        r"roll\s*(?:no|number)\s*[:\-]?\s*"
        r"([A-Za-z0-9-]+)",
        text,
        re.IGNORECASE
    )

    if roll_match:
        fields["certificate_number"] = (
            roll_match.group(1)
        )

    return fields