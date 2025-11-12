from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .config import get_settings
from .database import Base, engine, SessionLocal
from . import models, schemas, logic
import time

settings = get_settings()
app = FastAPI(title="Finler API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def require_api_key(x_api_key: str | None = Header(default=None)):
    if x_api_key is None:
        # allow demo by default but you can enforce:
        # raise HTTPException(status_code=401, detail="X-API-Key required")
        return
    if x_api_key != settings.INVEST_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")

@app.get("/api/health")
def health():
    return {"ok": True, "ts": int(time.time()*1000)}

@app.get("/api/catalog")
def catalog():
    return {"items": logic.CATALOG}

@app.post("/api/compute-plan", response_model=schemas.PlanOut)
def compute_plan(payload: schemas.PlanInput, db: Session = Depends(get_db), _auth=Depends(require_api_key)):
    res = logic.compute_plan(
        goal=payload.goal,
        target=payload.target,
        duration=payload.duration,
        income=payload.income,
        expenses=payload.expenses,
        risk=payload.risk,
    )
    # persist
    plan = models.Plan(data=res | {"computedAt": int(time.time()*1000)})
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan.data

@app.get("/api/plans")
def list_plans(db: Session = Depends(get_db), _auth=Depends(require_api_key)):
    rows = db.query(models.Plan).order_by(models.Plan.id.desc()).limit(50).all()
    return [{"id": r.id, "created_at": str(r.created_at), **r.data} for r in rows]
