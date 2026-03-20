"""Seed script to populate the pharmacy database with sample data."""

from datetime import date, timedelta
from database import engine, Base, SessionLocal
from models import Medicine, Sale

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing data
db.query(Sale).delete()
db.query(Medicine).delete()
db.commit()

# Sample Medicines
medicines = [
    Medicine(
        name="Paracetamol 500mg",
        generic_name="Acetaminophen",
        category="Analgesic",
        batch_no="BT-2025-001",
        expiry_date=date(2027, 6, 15),
        quantity=250,
        cost_price=1.20,
        mrp=2.50,
        supplier="PharmaCorp India",
        status="Active",
    ),
    Medicine(
        name="Amoxicillin 250mg",
        generic_name="Amoxicillin",
        category="Antibiotic",
        batch_no="BT-2025-002",
        expiry_date=date(2026, 12, 30),
        quantity=180,
        cost_price=3.50,
        mrp=6.00,
        supplier="MediSupply Ltd",
        status="Active",
    ),
    Medicine(
        name="Cetirizine 10mg",
        generic_name="Cetirizine Hydrochloride",
        category="Antihistamine",
        batch_no="BT-2025-003",
        expiry_date=date(2027, 3, 20),
        quantity=320,
        cost_price=0.80,
        mrp=1.50,
        supplier="HealthFirst Pharma",
        status="Active",
    ),
    Medicine(
        name="Metformin 500mg",
        generic_name="Metformin HCl",
        category="Antidiabetic",
        batch_no="BT-2024-010",
        expiry_date=date(2026, 8, 10),
        quantity=5,
        cost_price=2.00,
        mrp=4.50,
        supplier="DiaCare Pharma",
        status="Low Stock",
    ),
    Medicine(
        name="Omeprazole 20mg",
        generic_name="Omeprazole",
        category="Antacid",
        batch_no="BT-2025-005",
        expiry_date=date(2027, 1, 25),
        quantity=150,
        cost_price=1.80,
        mrp=3.50,
        supplier="GastroMed Inc",
        status="Active",
    ),
    Medicine(
        name="Ibuprofen 400mg",
        generic_name="Ibuprofen",
        category="Analgesic",
        batch_no="BT-2024-008",
        expiry_date=date(2025, 11, 5),
        quantity=45,
        cost_price=1.50,
        mrp=3.00,
        supplier="PharmaCorp India",
        status="Expired",
    ),
    Medicine(
        name="Azithromycin 500mg",
        generic_name="Azithromycin",
        category="Antibiotic",
        batch_no="BT-2025-006",
        expiry_date=date(2027, 9, 18),
        quantity=0,
        cost_price=8.00,
        mrp=15.00,
        supplier="MediSupply Ltd",
        status="Out of Stock",
    ),
    Medicine(
        name="Atorvastatin 10mg",
        generic_name="Atorvastatin Calcium",
        category="Cardiovascular",
        batch_no="BT-2025-007",
        expiry_date=date(2027, 4, 12),
        quantity=200,
        cost_price=2.50,
        mrp=5.00,
        supplier="HeartWell Pharma",
        status="Active",
    ),
    Medicine(
        name="Pantoprazole 40mg",
        generic_name="Pantoprazole Sodium",
        category="Antacid",
        batch_no="BT-2025-009",
        expiry_date=date(2027, 7, 22),
        quantity=8,
        cost_price=3.00,
        mrp=6.50,
        supplier="GastroMed Inc",
        status="Low Stock",
    ),
    Medicine(
        name="Losartan 50mg",
        generic_name="Losartan Potassium",
        category="Cardiovascular",
        batch_no="BT-2025-011",
        expiry_date=date(2027, 11, 30),
        quantity=110,
        cost_price=4.00,
        mrp=8.00,
        supplier="HeartWell Pharma",
        status="Active",
    ),
    Medicine(
        name="Clopidogrel 75mg",
        generic_name="Clopidogrel Bisulfate",
        category="Cardiovascular",
        batch_no="BT-2025-012",
        expiry_date=date(2027, 5, 14),
        quantity=90,
        cost_price=5.00,
        mrp=10.00,
        supplier="HeartWell Pharma",
        status="Active",
    ),
    Medicine(
        name="Dolo 650",
        generic_name="Paracetamol",
        category="Analgesic",
        batch_no="BT-2025-013",
        expiry_date=date(2027, 8, 28),
        quantity=500,
        cost_price=1.00,
        mrp=2.00,
        supplier="Micro Labs",
        status="Active",
    ),
]

db.add_all(medicines)
db.commit()

# Sample Sales
today = date.today()
sales = [
    Sale(
        invoice_no="INV-001",
        patient_name="Rahul Sharma",
        amount=450.00,
        items=3,
        payment_mode="UPI",
        date=today,
        status="Completed",
    ),
    Sale(
        invoice_no="INV-002",
        patient_name="Priya Patel",
        amount=280.00,
        items=2,
        payment_mode="Cash",
        date=today,
        status="Completed",
    ),
    Sale(
        invoice_no="INV-003",
        patient_name="Amit Kumar",
        amount=1250.00,
        items=5,
        payment_mode="Card",
        date=today,
        status="Completed",
    ),
    Sale(
        invoice_no="INV-004",
        patient_name="Sonal Gupta",
        amount=180.00,
        items=1,
        payment_mode="UPI",
        date=today,
        status="Completed",
    ),
    Sale(
        invoice_no="INV-005",
        patient_name="Vikram Singh",
        amount=760.00,
        items=4,
        payment_mode="Cash",
        date=today,
        status="Completed",
    ),
    Sale(
        invoice_no="INV-006",
        patient_name="Neha Reddy",
        amount=320.00,
        items=2,
        payment_mode="Card",
        date=today - timedelta(days=1),
        status="Completed",
    ),
    Sale(
        invoice_no="INV-007",
        patient_name="Deepak Joshi",
        amount=890.00,
        items=6,
        payment_mode="UPI",
        date=today - timedelta(days=1),
        status="Completed",
    ),
    Sale(
        invoice_no="INV-008",
        patient_name="Kavita Nair",
        amount=150.00,
        items=1,
        payment_mode="Cash",
        date=today - timedelta(days=2),
        status="Completed",
    ),
    Sale(
        invoice_no="INV-009",
        patient_name="Arjun Menon",
        amount=2100.00,
        items=8,
        payment_mode="Card",
        date=today - timedelta(days=2),
        status="Returned",
    ),
    Sale(
        invoice_no="INV-010",
        patient_name="Sneha Das",
        amount=540.00,
        items=3,
        payment_mode="UPI",
        date=today - timedelta(days=3),
        status="Completed",
    ),
]

db.add_all(sales)
db.commit()
db.close()

print("✅ Database seeded successfully!")
print(f"   → {len(medicines)} medicines added")
print(f"   → {len(sales)} sales records added")
