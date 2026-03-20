from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import dashboard, inventory
from models import Medicine

Base.metadata.create_all(bind=engine)

# Auto-seed if database is empty (first deploy)
db = SessionLocal()
if db.query(Medicine).count() == 0:
    db.close()
    import seed  # runs the seed script
else:
    db.close()

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
