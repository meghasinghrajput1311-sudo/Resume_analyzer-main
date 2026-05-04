import PyPDF2
from docx import Document
import re
from .job_data import JOB_DATABASE


# -------------------------------
# Skill aliases (normalized)
# -------------------------------
SKILL_ALIASES = {
    "javascript": ["js", "javascript"],
    "react": ["react", "reactjs"],
    "node": ["node", "nodejs"],
    "python": ["python", "py"],
    "powerbi": ["powerbi", "pbi"],
}


# -------------------------------
# Resume text extraction
# -------------------------------
def extract_text_from_resume(resume_file):
    filename = getattr(resume_file, "name", "").lower()

    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(resume_file)
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    elif filename.endswith(".docx"):
        document = Document(resume_file)
        return "\n".join(p.text for p in document.paragraphs)

    else:
        raise ValueError("Unsupported resume format. Upload PDF or DOCX.")


# -------------------------------
# Extract Email
# -------------------------------
def extract_email(text):
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(pattern, text)
    return match.group(0) if match else None


# -------------------------------
# Extract Phone Number
# -------------------------------
def extract_phone(text):
    pattern = r"\+?\d[\d\s-]{8,}\d"
    match = re.search(pattern, text)
    return match.group(0) if match else None


# -------------------------------
# SAFE skill matching (FIXED)
# -------------------------------
def extract_resume_skills(resume_text):
    resume_text = resume_text.lower()
    found_skills = set()

    for job in JOB_DATABASE.values():
        for skill in job.get("skills", []):  # ✅ SAFE
            skill_lower = skill.lower()

            aliases = SKILL_ALIASES.get(skill_lower, [skill_lower])

            for alias in aliases:
                # ✅ FIX: word boundary (NO false matches)
                pattern = rf"\b{re.escape(alias)}\b"
                if re.search(pattern, resume_text):
                    found_skills.add(skill_lower)
                    break

    return sorted(found_skills)


# -------------------------------
# Extract job skills (optional)
# -------------------------------
def extract_job_skills(job_role):
    job = JOB_DATABASE.get(job_role.lower())

    if not job:
        raise ValueError("Invalid job role")

    return [skill.lower() for skill in job.get("skills", [])]


# -------------------------------
# Match skills
# -------------------------------
def match_job_skills(resume_skills, job_skills):
    resume_set = set(resume_skills)
    job_set = set(job_skills)

    matched = sorted(resume_set & job_set)
    missing = sorted(job_set - resume_set)

    score = round((len(matched) / len(job_set)) * 100, 2) if job_set else 0

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "match_score": score,
        "qualified": score >= 70,
    }


# -------------------------------
# MAIN FUNCTION
# -------------------------------
def analyze_resume(resume_file, job_role):
    resume_text = extract_text_from_resume(resume_file)

    email = extract_email(resume_text)
    phone = extract_phone(resume_text)

    resume_skills = extract_resume_skills(resume_text)
    job_skills = extract_job_skills(job_role)

    result = match_job_skills(resume_skills, job_skills)

    return {
        "job_role": job_role.lower(),
        "email": email,
        "phone": phone,
        "resume_skills": resume_skills,
        **result
    }