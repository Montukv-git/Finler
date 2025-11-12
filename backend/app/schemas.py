from pydantic import BaseModel, Field
from typing import List, Literal, Optional

Risk = Literal["Low", "Medium", "High"]

class PlanInput(BaseModel):
    goal: str
    target: float
    duration: float  # years
    income: float
    expenses: float
    risk: Risk

class SplitItem(BaseModel):
    name: str
    value: float

class ProjectionPoint(BaseModel):
    year: int
    conservative: float
    moderate: float
    aggressive: float

class PlanOut(BaseModel):
    savings: float
    conservative: float
    moderate: float
    aggressive: float
    investmentSplit: List[SplitItem]
    projection: List[ProjectionPoint]
    target: float
    durationYears: float
    plans: list
    computedAt: int = Field(..., alias="computedAt")
