from yahooquery import search, Ticker

def search_stock(query):
    try:
        results = search(query)

        quotes = results.get("quotes", [])

        return [
            {
                "symbol": item.get("symbol"),
                "shortname": item.get("shortname") or item.get("longname") or "Nom inconnu"
            }
            for item in quotes[:5]
        ]
    except Exception as e:
        return [{"error": e}]

def get_daily_var(symbol):
    try:
        value = Ticker(symbol)
        price_data = value.price[symbol]

        regular_market_price = price_data.get('regularMarketPrice')
        previous_close = price_data.get('regularMarketPreviousClose')

        if regular_market_price and previous_close:
            change_percent = ((regular_market_price - previous_close) / previous_close) * 100
            return {"change": change_percent}
        else:
            return {"error":f"Données indisponibles pour {symbol}"}

    except Exception as e:
        return [{"error": e}]


def get_stock_details(symbol):
    try:
        ticker = Ticker(symbol)
        price_data = ticker.price.get(symbol, {})

        return {
            "symbol": symbol,
            "shortname":price_data.get("shortName"),
            "currentPrice": price_data.get("regularMarketPrice"),
            "dailyChange": price_data.get("regularMarketChangePercent"),
            "openingPrice": price_data.get("regularMarketOpen"),
            "previousClosingPrice": price_data.get("regularMarketPreviousClose"),
            "dailyMax": price_data.get("regularMarketDayHigh"),
            "dailyLow": price_data.get("regularMarketDayLow"),
            "dailyVolume": price_data.get("regularMarketVolume"),
            "capitalisation": price_data.get("marketCap"),
        }

    except Exception as e:
        print(f"Erreur lors de la récupération des données pour {symbol} : {e}")
        return None

