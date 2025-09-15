from fastapi import FastAPI, File, UploadFile
import shutil
import os
import requests
from extract import extract

app = FastAPI()

os.makedirs("inputfiles", exist_ok=True)

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    file_path = os.path.join("inputfiles", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract(file_path)

    output_file_path = "output.txt"
    with open(output_file_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)

    response = requests.get("http://localhost:3000/generate-quiz")
    response_json = response.json() if response.headers.get('content-type') == 'application/json' else response.text

    return {
        "quiz_response": response.text,
        "filename": file.filename
    }