
# Finler — Fullstack Starter (FastAPI + Vite React + SQLite)

## 1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.sample .env
uvicorn app.main:app --reload --port 8000
```

## 2) Frontend
```bash
cd frontend
npm install
cp .env.sample .env
npm run dev
```

Open http://localhost:5173

## Build
- `npm run build` in frontend
- Serve `frontend/dist` via any static host (Netlify/Vercel/Nginx)
- Deploy FastAPI wherever you like (Railway, Render, EC2).

## Notes
- Demo API key is `DEMO_KEY_123` (you can enforce header validation by uncommenting in `require_api_key`).
- SQLite DB is created at `backend/db/finler.db` automatically.
