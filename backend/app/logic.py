from typing import List, Dict, Literal
import math

Risk = Literal["Low", "Medium", "High"]

CATALOG = [
    { "id": "elss1", "name": "ELSS Tax Saver Growth", "category": "ELSS (Tax Saving)", "risk": "Medium", "historical": { "y3": 17.2, "y5": 15.1, "y10": 13.4 }, "expenseRatio": 0.9, "lockIn": "3 yrs", "taxBenefit": "80C up to ₹1.5L", "minSip": 500, "rating": 5, "affiliateUrl": "#", "blurb": "Equity-linked savings with Section 80C tax benefits." },
    { "id": "elss2", "name": "ELSS Flexi Equity", "category": "ELSS (Tax Saving)", "risk": "Medium", "historical": { "y3": 16.1, "y5": 14.5, "y10": 12.8 }, "expenseRatio": 1.1, "lockIn": "3 yrs", "taxBenefit": "80C up to ₹1.5L", "minSip": 500, "rating": 4, "affiliateUrl": "#", "blurb": "Diversified ELSS suitable for salaried investors." },
    { "id": "eq1", "name": "Bluechip Equity SIP", "category": "Equity SIP", "risk": "High", "historical": { "y3": 18.5, "y5": 16.3, "y10": 14.1 }, "expenseRatio": 0.8, "lockIn": "None", "taxBenefit": None, "minSip": 1000, "rating": 5, "affiliateUrl": "#", "blurb": "Large-cap focused for stability with growth." },
    { "id": "eq2", "name": "Flexicap Growth SIP", "category": "Equity SIP", "risk": "High", "historical": { "y3": 20.2, "y5": 17.4, "y10": 15.0 }, "expenseRatio": 1.0, "lockIn": "None", "taxBenefit": None, "minSip": 1000, "rating": 4, "affiliateUrl": "#", "blurb": "Dynamic allocation across market caps." },
    { "id": "debt1", "name": "Corporate Bond Fund", "category": "Debt Fund", "risk": "Low", "historical": { "y3": 7.4, "y5": 7.1, "y10": 7.0 }, "expenseRatio": 0.4, "lockIn": "None", "taxBenefit": None, "minSip": 500, "rating": 4, "affiliateUrl": "#", "blurb": "Quality corporate papers for steady income." },
    { "id": "debt2", "name": "Short Duration Debt", "category": "Debt Fund", "risk": "Low", "historical": { "y3": 6.8, "y5": 6.9, "y10": 6.7 }, "expenseRatio": 0.35, "lockIn": "None", "taxBenefit": None, "minSip": 500, "rating": 4, "affiliateUrl": "#", "blurb": "Lower interest-rate risk; good for parking surplus." },
    { "id": "ppf", "name": "PPF (Public Provident Fund)", "category": "PPF", "risk": "Low", "historical": { "y3": 7.1, "y5": 7.1, "y10": 7.7 }, "expenseRatio": 0, "lockIn": "15 yrs (partial from 7th)", "taxBenefit": "80C + EEE", "minSip": 500, "rating": 5, "affiliateUrl": "#", "blurb": "Govt-backed, tax-free compounding; long-term." },
    { "id": "nps1", "name": "NPS Tier I (Auto Choice)", "category": "NPS", "risk": "Medium", "historical": { "y3": 10.5, "y5": 9.8, "y10": 9.2 }, "expenseRatio": 0.1, "lockIn": "Till retirement", "taxBenefit": "80C + 80CCD(1B)", "minSip": 500, "rating": 4, "affiliateUrl": "#", "blurb": "Lifecycle-based asset mix + additional tax benefit." }
]

def to_number(x) -> float:
    try:
        return float(str(x).replace(',', ''))
    except Exception:
        return 0.0

def project_fv(monthly: float, rate_monthly: float, months: int) -> float:
    if rate_monthly > 0:
        return monthly * ((1 + rate_monthly) ** months - 1) / rate_monthly
    return monthly * months

def pick_plans(risk: Risk, monthly_savings: float):
    shortlist = []
    def push_top(category: str, n: int):
        items = [p for p in CATALOG if p["category"] == category]
        items.sort(key=lambda p: (p["historical"]["y5"] or 0), reverse=True)
        shortlist.extend(items[:n])
    if risk == "Low":
        push_top("Debt Fund", 2); push_top("PPF", 1)
        if monthly_savings >= 3000: push_top("NPS", 1)
    elif risk == "Medium":
        push_top("ELSS (Tax Saving)", 2); push_top("Debt Fund", 1); push_top("NPS", 1)
    else:
        push_top("Equity SIP", 2); push_top("ELSS (Tax Saving)", 1)
        if monthly_savings >= 5000: push_top("NPS", 1)
    # unique by id
    seen = set()
    unique = []
    for p in shortlist:
        if p["id"] not in seen:
            unique.append(p); seen.add(p["id"])
    return unique

def compute_plan(goal: str, target: float, duration: float, income: float, expenses: float, risk: Risk):
    savings = max(0.0, income - expenses)
    rC, rM, rA = 0.06, 0.10, 0.14
    mC, mM, mA = rC/12, rM/12, rA/12
    n = int(round(duration * 12))

    conservative = round(project_fv(savings, mC, n))
    moderate = round(project_fv(savings, mM, n))
    aggressive = round(project_fv(savings, mA, n))

    projection = []
    for y in range(int(math.floor(duration)) + 1):
        months = y * 12
        projection.append({
            "year": y,
            "conservative": round(project_fv(savings, mC, months)),
            "moderate": round(project_fv(savings, mM, months)),
            "aggressive": round(project_fv(savings, mA, months)),
        })

    split = [
        { "name": "FD/PPF", "value": 60 if risk == "Low" else (30 if risk == "Medium" else 10) },
        { "name": "SIP/Mutual Funds", "value": 40 if risk == "Low" else (50 if risk == "Medium" else 60) },
        { "name": "Stocks/NPS", "value": 0 if risk == "Low" else (20 if risk == "Medium" else 30) },
    ]

    plans = pick_plans(risk, savings)

    return {
        "savings": savings,
        "conservative": conservative,
        "moderate": moderate,
        "aggressive": aggressive,
        "investmentSplit": split,
        "projection": projection,
        "target": target,
        "durationYears": duration,
        "plans": plans
    }
