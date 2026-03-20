from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from database import get_db
from models import Medicine, Sale

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    today = date.today()
    today_sales = db.query(Sale).filter(Sale.date == today).all()
    total_sales = sum(s.amount for s in today_sales)
    items_sold = sum(s.items for s in today_sales)
    low_stock = db.query(Medicine).filter(Medicine.status == "Low Stock").count()
    total_medicines = db.query(Medicine).count()
    return {
        "today_sales": total_sales,
        "items_sold": items_sold,
        "low_stock_count": low_stock,
        "total_medicines": total_medicines,
        "sales_change_pct": 12.5,
    }


@router.get("/purchase-orders")
def get_purchase_orders(db: Session = Depends(get_db)):
    return {"total": 96250, "pending": 5, "status": "Pending"}


@router.get("/recent-sales")
def get_recent_sales(db: Session = Depends(get_db)):
    sales = db.query(Sale).order_by(Sale.date.desc()).limit(10).all()
    return sales
