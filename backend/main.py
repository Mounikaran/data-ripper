from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from health import router as health_router
from ripper import router as ripper_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(health_router)
app.include_router(ripper_router)
