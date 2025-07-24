import json
import os
import smtplib
from email.message import EmailMessage
from urllib.parse import urlencode

from sqlmodel import Session

from earlycareers import crud
from earlycareers.core.database import engine

WEBSITE_URL = os.environ.get("WEBSITE_URL", "http://localhost:5173")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "noreply@example.com")
SMTP_HOST = os.environ.get("SMTP_HOST", "localhost")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "25"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")


def _send_email(to_addr: str, subject: str, body: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_addr
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        if SMTP_USER and SMTP_PASS:
            smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(msg)


def send_weekly_emails() -> None:
    with Session(engine) as session:
        subs = crud.get_active_subscriptions(session=session)
        for sub in subs:
            params = json.loads(sub.search_json)
            jobs = crud.get_jobs(session=session, page=1, limit=5, search=params.get("q", ""))
            if params.get("advanced"):
                jobs = crud.get_jobs_advanced(
                    session=session,
                    page=1,
                    limit=5,
                    title=params.get("title", []),
                    company=params.get("company", []),
                    location=params.get("location", []),
                    description=params.get("description", []),
                )
            lines = [f"{j.title} - {j.company} ({j.location})" for j in jobs]
            results_text = "\n".join(lines) if lines else "No results found."
            query = urlencode(params, doseq=True)
            search_link = f"{WEBSITE_URL}/jobs?{query}"
            unsubscribe_link = f"{WEBSITE_URL}/api/subscriptions/unsubscribe/{sub.unsubscribe_token}"
            body = (
                f"Here are the latest results for your saved search:\n\n{results_text}\n\n"
                f"See all results: {search_link}\n\nUnsubscribe: {unsubscribe_link}\n"
            )
            _send_email(sub.email, "Your weekly internship results", body)
