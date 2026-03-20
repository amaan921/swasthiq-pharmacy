from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
import enum


class MedicineStatus(str, enum.Enum):
    active = "Active"
    low_stock = "Low Stock"
    expired = "Expired"
    out_of_stock = "Out of Stock"


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    generic_name = Column(String)
    category = Column(String)
    batch_no = Column(String)
    expiry_date = Column(Date)
    quantity = Column(Integer, default=0)
    cost_price = Column(Float, default=0.0)
    mrp = Column(Float, default=0.0)
    supplier = Column(String)
    status = Column(String, default="Active")


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String)
    patient_name = Column(String)
    amount = Column(Float)
    items = Column(Integer)
    payment_mode = Column(String)
    date = Column(Date)
    status = Column(String, default="Completed")
