import PyPDF2
from docx import Document
import re
from .job_data import JOB_DATABASE

SKILL_ALIASES = {
    "javascript": ["js", "javascript"],
    "react": ["react", "reactjs"],
    "node": ["node", "nodejs"],
    "python": ["python", "py"],
    "powerbi": ["powerbi","PowerBI","PBI"],
}


# Resume text extraction
def extract_text_from_resume(resume_file):
    filename = getattr(resume_file, "name", "").lower()

    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(resume_file)
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    if filename.endswith(".docx"):
        document = Document(resume_file)
        return "\n".join(paragraph.text for paragraph in document.paragraphs)

    raise ValueError("Unsupported resume format. Please upload a PDF or DOCX file.")


# Extract Email
def extract_email(text):
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(pattern, text)
    return match.group(0) if match else None

# Extract Phone Number
def extract_phone(text):
    pattern = r"\+?\d[\d\s-]{8,}\d"
    match = re.search(pattern, text)
    return match.group(0) if match else None



# Extract Resume Skills Based On JOB_DATABASE
def extract_resume_skills(resume_text):
    resume_text = resume_text.lower()
    found_skills = set()

    for job in JOB_DATABASE.values():
        for skill in job["skills"]:
            skill_lower = skill.lower()

            # Get aliases for this skill
            aliases = SKILL_ALIASES.get(skill_lower, [skill_lower])

            for alias in aliases:
                if alias in resume_text:
                    found_skills.add(skill_lower)
                    break

    return sorted(found_skills)


# Extract skills from job description text
def extract_job_skills(job_desc):
    job_text = job_desc.lower()
    found_skills = set()

    for job in JOB_DATABASE.values():
        for skill in job["skills"]:
            skill_lower = skill.lower()
            aliases = SKILL_ALIASES.get(skill_lower, [skill_lower])

            for alias in aliases:
                if alias in job_text:
                    found_skills.add(skill_lower)
                    break

    return sorted(found_skills)


# Match resume skills against extracted job skills
def match_job_skills(resume_skills, job_skills):
    resume_set = {skill.lower() for skill in resume_skills}
    job_set = {skill.lower() for skill in job_skills}

    matched_skills = sorted(skill for skill in job_set if skill in resume_set)
    missing_skills = sorted(skill for skill in job_set if skill not in resume_set)
    score = round((len(matched_skills) / len(job_set)) * 100, 2) if job_set else 0.0

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_score": score,
        "qualified": score >= 70,
    }





# Match Skills

# def match_skills(resume_text, job_desc):
#     resume_words = resume_text.lower().split()
#     job_words = job_desc.lower().split()

#     matched = set(resume_words) & set(job_words)

#     score = (len(matched) / len(set(job_words))) * 100 if job_words else 0

#     return list(matched), round(score, 2)