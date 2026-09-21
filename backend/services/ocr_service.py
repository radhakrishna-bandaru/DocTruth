import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import fitz


pytesseract.pytesseract.tesseract_cmd = r"D:\Tesseract-OCR\tesseract.exe"


def improve_image(image):
    # Convert to grayscale
    image = image.convert("L")

    # Increase contrast
    image = ImageEnhance.Contrast(image).enhance(2)

    # Sharpen image
    image = image.filter(ImageFilter.SHARPEN)

    return image


def extract_text_from_image(image_path):

    image = Image.open(image_path)

    image = improve_image(image)

    text = pytesseract.image_to_string(
        image,
        config="--psm 6"
    )

    return text


def extract_text_from_pdf(pdf_path):

    pdf = fitz.open(pdf_path)

    full_text = ""

    for page in pdf:

        # Higher resolution for better OCR
        pix = page.get_pixmap(
            matrix=fitz.Matrix(2, 2)
        )

        image = Image.frombytes(
            "RGB",
            [pix.width, pix.height],
            pix.samples
        )

        image = improve_image(image)

        text = pytesseract.image_to_string(
            image,
            config="--psm 6"
        )

        full_text += text + "\n"

    pdf.close()

    return full_text