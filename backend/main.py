from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import dashboard, inventory

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SwasthiQ Pharmacy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(inventory.router)


@app.get("/")
def root():
    return {"message": "SwasthiQ Pharmacy API is running"}
