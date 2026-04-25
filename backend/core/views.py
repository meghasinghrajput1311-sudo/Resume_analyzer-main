from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import (
    extract_text_from_resume,
    extract_email,
    extract_phone,
    extract_resume_skills,
    extract_job_skills,
    match_job_skills,
)


@csrf_exempt
def analyze_resume(request):
    if request.method == "POST":
        resume_file = request.FILES.get("resume_file")
        job_desc = request.POST.get("jd_text")

        if not resume_file or not job_desc:
            return JsonResponse({"error": "Missing resume file or job description"}, status=400)

        try:
            resume_text = extract_text_from_resume(resume_file)
        except ValueError as exc:
            return JsonResponse({"error": str(exc)}, status=400)
        except Exception:
            return JsonResponse({"error": "Failed to parse the uploaded resume"}, status=400)

        email = extract_email(resume_text)
        phone = extract_phone(resume_text)

        resume_skills = extract_resume_skills(resume_text)
        job_skills = extract_job_skills(job_desc)
        match_result = match_job_skills(resume_skills, job_skills)

        return JsonResponse({
            "email": email,
            "phone": phone,
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            **match_result,
        })

    return JsonResponse({"error": "Only POST allowed"}, status=405)