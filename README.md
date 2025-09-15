# Automatic Form Generator Backend

This backend powers an automatic form generator tool that creates quizzes and forms from any PDF document. Upload a PDF, and the system extracts its content, analyzes it, and generates relevant quiz questions or forms automatically.

## Features

- **PDF Extraction:** Extracts text and images from uploaded PDFs using OCR when needed.
- **Quiz/Form Generation:** Converts extracted content into quizzes or forms with minimal user input.
- **API-Driven:** FastAPI backend for file upload and quiz generation endpoints.

## Project Structure

- `pdf-extractor/` — Handles PDF upload, extraction, and OCR processing.
- `quiz-generator/` — Generates quizzes/forms from extracted content.

## Quick Start

1. Install dependencies in each subfolder's virtual environment.
2. Start the FastAPI server in `pdf-extractor/`:
   ```sh
   uvicorn server:app --reload
   ```
3. Start the quiz generator server in `quiz-generator/` as needed.

---

This backend enables seamless, automated quiz and form creation from any PDF. Perfect for educators, recruiters, and anyone needing fast content digitization.
