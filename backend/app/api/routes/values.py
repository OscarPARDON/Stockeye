from fastapi import APIRouter
from backend.app.services.yahoo_finance import search_stock, get_daily_var, get_stock_details

router_values = APIRouter()

@router_values.get("/search/{query}")
def search(query : str):
    return {"status":200, "results":search_stock(query)}

@router_values.get("/dailyvar/{symbol}")
def dailyVar(symbol : str):
    return {"status":200, "results":get_daily_var(symbol)}

@router_values.get("/details/{symbol}")
def details(symbol : str):
    return {"status":200, "results":get_stock_details(symbol)}
