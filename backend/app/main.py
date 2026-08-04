from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core_config import settings

# Import API subrouters
from app.api.contracts import router as contracts_router
from app.api.analysis import router as analysis_router
from app.api.chat import router as chat_router
from app.api.negotiation import router as negotiation_router
from app.api.compliance import router as compliance_router
from app.api.compare import router as compare_router
from app.api.similarity import router as similarity_router
from app.api.reports import router as reports_router
from app.api.analytics import router as analytics_router
from app.api.lifecycle import router as lifecycle_router
from app.api.insights_nextgen import router as insights_nextgen_router
from app.api.radar import router as radar_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS Middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(contracts_router, prefix=settings.API_V1_STR)
app.include_router(analysis_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(negotiation_router, prefix=settings.API_V1_STR)
app.include_router(radar_router, prefix=settings.API_V1_STR)
app.include_router(compliance_router, prefix=settings.API_V1_STR)
app.include_router(compare_router, prefix=settings.API_V1_STR)
app.include_router(similarity_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(lifecycle_router, prefix=settings.API_V1_STR)
app.include_router(insights_nextgen_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }
