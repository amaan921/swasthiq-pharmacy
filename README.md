# SwasthiQ Pharmacy Management System

This is a pharmacy management dashboard I built using FastAPI for the backend and React (with Vite) on the frontend. It uses SQLite for storage and has a dark-themed UI.

## Tech Stack

- **Frontend:** React 19, Vite, Axios, React Router
- **Backend:** FastAPI, SQLAlchemy, Uvicorn
- **Database:** SQLite (file: `pharmacy.db`)
- **Styling:** Plain CSS with Inter font, dark theme throughout

## Running it locally

### Backend

```bash
cd backend
pip3 install -r requirements.txt
python3 seed.py   # fills in some sample data
uvicorn main:app --reload
```

This starts the API at http://localhost:8000. You can also check out the auto-generated docs at http://localhost:8000/docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens up at http://localhost:5173. Make sure the backend is already running before you start this.

If you need to point the frontend at a different API URL (like after deploying), just create a `frontend/.env` file:

```
VITE_API_URL=https://your-backend-url.com
```

## REST API Structure

I split the API into two routers — one for the dashboard and one for inventory management.

### Dashboard endpoints

| Method | Path | What it does |
|--------|------|-------------|
| GET | `/api/dashboard/summary` | Returns today's sales total, items sold, and low stock count |
| GET | `/api/dashboard/purchase-orders` | Returns purchase order summary |
| GET | `/api/dashboard/recent-sales` | Returns the last 10 sale records |

### Inventory endpoints

| Method | Path | What it does |
|--------|------|-------------|
| GET | `/api/inventory/` | Lists all medicines. Supports `?search=`, `?status=`, `?category=` query params for filtering |
| GET | `/api/inventory/overview` | Returns inventory stats like total count, active count, and total stock value |
| POST | `/api/inventory/` | Adds a new medicine |
| PUT | `/api/inventory/{id}` | Updates an existing medicine (full replace) |
| PATCH | `/api/inventory/{id}/status` | Updates just the status field |

### Sample request/response

**POST /api/inventory/** — request body:

```json
{
  "name": "Paracetamol 500mg",
  "generic_name": "Acetaminophen",
  "category": "Analgesic",
  "batch_no": "BT-2025-001",
  "expiry_date": "2027-06-15",
  "quantity": 250,
  "cost_price": 1.2,
  "mrp": 2.5,
  "supplier": "PharmaCorp India"
}
```

**GET /api/dashboard/summary** — response:

```json
{
  "today_sales": 2920.0,
  "items_sold": 15,
  "low_stock_count": 2,
  "total_medicines": 12,
  "sales_change_pct": 12.5
}
```

## How data consistency works

This was one of the trickier parts. Whenever a medicine is added or updated, I don't trust the client to send the correct status. Instead, the backend recalculates it automatically based on the actual data.

Inside both the POST and PUT handlers, right before committing to the database, I run this logic:

```python
if quantity == 0:
    status = "Out of Stock"
elif expiry_date < today:
    status = "Expired"
elif quantity < 10:
    status = "Low Stock"
else:
    status = "Active"
```

So even if someone sends `"status": "Active"` for a medicine with 0 quantity, the backend will override it to "Out of Stock". Everything happens in a single SQLAlchemy transaction — the record is fetched, fields are updated, status is recalculated, and only then `db.commit()` is called. If anything fails, the whole thing rolls back.

This keeps the inventory status always in sync with the actual quantity and expiry date, without relying on the frontend to get it right.

## Deploying

- **Backend** — I'd use Render.com. Push the `/backend` folder, set build command to `pip install -r requirements.txt`, and start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend** — Vercel works well. Import the repo, set root directory to `frontend`, and add `VITE_API_URL` as an environment variable pointing to your Render URL
- **Database** — For production you'd want to swap SQLite for Postgres (Supabase makes this easy). Just update the connection string in `database.py`
