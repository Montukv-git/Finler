from sqlalchemy import Column, Integer, DateTime, text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from .database import Base

class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=text("(DATETIME('now'))"))
    data = Column(SQLiteJSON, nullable=False)
