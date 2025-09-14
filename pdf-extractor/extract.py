import fitz
import pytesseract
from PIL import Image
import re

def is_mostly_english(text):
    if not text.strip():
        return False
    
    # Removing punctuations 
    cleaned_text = re.sub(r'[\d\s.,!?;:"(){}\[\]-]', '', text)
    
    if not cleaned_text:
        return False

    total_chars = len(cleaned_text)
    non_ascii_chars = sum(1 for char in cleaned_text if ord(char) > 127)
    
    # If more than 10% of characters are non-ASCII, it's not English language
    if (non_ascii_chars / total_chars) > 0.1:
        return False
    
    return True

def extract(path, lang="ben+hin+eng"):
    doc = fitz.open(path)
    full_text = ""

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text")

        if is_mostly_english(text):
            full_text += f"\n--- Page {page_num} ---\n{text}\n"
        else:
            print(f"OCR processing page {page_num} for {path}...")
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            ocr_text = pytesseract.image_to_string(img, lang=lang)
            full_text += f"\n--- Page {page_num} (OCR) ---\n{ocr_text}\n"

    return full_text

pdf_file = "swapno.pdf"  
print(f"Processing {pdf_file}...")
extracted_text = extract(pdf_file)
with open("output.txt", "w", encoding="utf-8") as f:
    f.write(extracted_text)
print("✅ Extraction complete -> output.txt")


