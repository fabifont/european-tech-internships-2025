from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from earlycareers.api import router
from earlycareers.core.config import settings
from earlycareers.notifications import send_weekly_emails


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    openapi_url=f"{settings.API_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    docs_url=f"{settings.API_STR}/docs",
    redoc_url=f"{settings.API_STR}/redoc",
)

# schedule weekly notification emails at 08:00 UTC every Monday
scheduler = AsyncIOScheduler(timezone="UTC")
scheduler.add_job(send_weekly_emails, "cron", day_of_week="mon", hour=8, minute=0)

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(router, prefix=settings.API_STR)


@app.on_event("startup")
async def start_scheduler() -> None:
    scheduler.start()


@app.on_event("shutdown")
async def shutdown_scheduler() -> None:
    scheduler.shutdown()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
