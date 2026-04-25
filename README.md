# Resume Analyzer

Resume Analyzer is a Django + React web application that evaluates a resume against a job description using rule-based skill matching.  
The backend processes the resume and job description, extracts skills, calculates a match score, and returns structured JSON to the frontend dashboard.

## Architecture

- **Frontend:** React with Vite (`frontend/`)
- **Backend:** Django (`backend/`)
- **Database:** SQLite (built-in)
- **Analysis Method:** Rule-based skill matching (no AI/LLM)
- **Main API endpoint:** `POST /api/analyze`

## Features

- Resume parsing (PDF and DOCX support)
- Email and phone number extraction
- Skill extraction from resume and job description
- Skill matching with alias support (e.g., "js" → "javascript")
- Match score calculation (percentage)
- Qualified/Not Qualified verdict based on 70% threshold

## Local Setup

### 1) Start backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 8000
```

### 2) Start frontend

```bash
cd frontend
npm install
npm run dev
```

**Frontend URL:** `http://localhost:5173`  
**Backend URL:** `http://localhost:8000`

## Configuration

Backend environment variables in `backend/.env`:

```env
FRONTEND_ORIGIN=http://localhost:5173
MAX_FILE_SIZE_MB=5
```

## API Behavior

### `POST /api/analyze`

Accepts multipart form data:
- `resume_file` (`.pdf` or `.docx`, max 5MB)
- `jd_text` (job description, 50-5000 characters)

**Processing Flow:**
1. Parse resume file (PDF or DOCX)
2. Extract email address from resume
3. Extract phone number from resume
4. Extract skills from resume using skill database
5. Extract skills from job description
6. Match skills and calculate score
7. Return JSON response to frontend

**Response includes:**
- `email` - Extracted email address
- `phone` - Extracted phone number
- `resume_skills` - Skills found in resume
- `job_skills` - Skills required in job description
- `matched_skills` - Skills that match between resume and JD
- `missing_skills` - Skills required but not found in resume
- `match_score` - Percentage match score (0-100)
- `qualified` - Boolean, true if score >= 70%

**Error responses:**
- `400` - Missing resume file or job description, parsing errors, unsupported format
- `405` - Method not allowed (only POST supported)

## Skill Database

The application includes a predefined skill database in `backend/core/job_data.py`:

| Job Role | Skills |
|----------|--------|
| Frontend Developer | html, css, javascript, react, git |
| Backend Developer | python, django, sql, api, git |
| Full Stack Developer | html, css, javascript, react, python, django, sql, api |
| Data Analyst | python, pandas, numpy, sql, excel |

Skill aliases are supported (e.g., "js" → "javascript", "py" → "python").

## Project Structure

```
Resume_Analyzer/
├── backend/
│   ├── core/
│   │   ├── views.py       # API endpoint
│   │   ├── utils.py       # Resume parsing & skill matching
│   │   ├── job_data.py    # Skill database
│   │   └── urls.py        # URL routing
│   ├── backend/
│   │   └── settings.py    # Django settings
│   ├── .env               # Environment variables
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # API utilities
│   └── package.json       # Node dependencies
└── README.md
```

## Tech Stack

- **Backend:** Django 6.0.2, Django CORS Headers, PyPDF2, python-docx
- **Frontend:** React 18, Vite, Tailwind CSS, ESLint
