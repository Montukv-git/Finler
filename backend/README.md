# Finler Backend (FastAPI)

## Quickstart
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.sample .env
uvicorn app.main:app --reload --port 8000
```

API:
- GET /api/health
- GET /api/catalog
- POST /api/compute-plan  (JSON body: goal, target, duration, income, expenses, risk)
- GET /api/plans
