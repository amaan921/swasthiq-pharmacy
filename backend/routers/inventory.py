from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
from database import get_db
from models import Medicine

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


class MedicineCreate(BaseModel):
    name: str
    generic_name: str
    category: str
    batch_no: str
    expiry_date: date
    quantity: int
    cost_price: float
    mrp: float
    supplier: str


def _auto_status(med: Medicine):
    """Auto-recalculate status based on quantity and expiry."""
    if med.quantity == 0:
        med.status = "Out of Stock"
    elif med.expiry_date and med.expiry_date < date.today():
        med.status = "Expired"
    elif med.quantity < 10:
        med.status = "Low Stock"
    else:
        med.status = "Active"


@router.get("/")
def list_medicines(
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Medicine)
    if search:
        q = q.filter(Medicine.name.ilike(f"%{search}%"))
    if status:
        q = q.filter(Medicine.status == status)
    if category:
        q = q.filter(Medicine.category == category)
    return q.all()


@router.get("/overview")
def inventory_overview(db: Session = Depends(get_db)):
    total = db.query(Medicine).count()
    active = db.query(Medicine).filter(Medicine.status == "Active").count()
    low = db.query(Medicine).filter(Medicine.status == "Low Stock").count()
    expired = db.query(Medicine).filter(Medicine.status == "Expired").count()
    out_of_stock = db.query(Medicine).filter(Medicine.status == "Out of Stock").count()
    total_value = sum(m.mrp * m.quantity for m in db.query(Medicine).all())
    return {
        "total": total,
        "active": active,
        "low_stock": low,
        "expired": expired,
        "out_of_stock": out_of_stock,
        "total_value": total_value,
    }


@router.post("/", status_code=201)
def add_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = Medicine(**medicine.dict())
    _auto_status(db_medicine)
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine


@router.put("/{medicine_id}")
def update_medicine(
    medicine_id: int, medicine: MedicineCreate, db: Session = Depends(get_db)
):
    db_med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Not found")
    for key, val in medicine.dict().items():
        setattr(db_med, key, val)
    _auto_status(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med


@router.patch("/{medicine_id}/status")
def update_status(medicine_id: int, status: str, db: Session = Depends(get_db)):
    db_med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Not found")
    db_med.status = status
    db.commit()
    return {"message": "Status updated"}
