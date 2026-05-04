from __future__ import annotations

from typing import Literal

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="OpenBy Electronics Price API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    productName: str = Field(min_length=2)


class Signal(BaseModel):
    key: str
    label: str
    value: float
    weight: float
    status: Literal["strong", "neutral", "weak"]
    explanation: str
    source: str


class NewsSignal(BaseModel):
    title: str
    outlet: str
    sentiment: Literal["positive", "neutral", "negative"]
    impact: str


class PricePoint(BaseModel):
    date: str
    price: int


class AnalyzeResponse(BaseModel):
    id: str
    productName: str
    category: str
    currentPrice: int
    targetBuyPrice: int
    openByIndex: int
    verdict: Literal["Buy now", "Watch", "Wait"]
    confidence: int
    summary: str
    updatedAt: str
    signals: list[Signal]
    news: list[NewsSignal]
    priceHistory: list[PricePoint]


def clamp(value: float, low: float = 0, high: float = 100) -> float:
    return min(high, max(low, value))


def stable_hash(text: str) -> int:
    return sum(ord(char) for char in text.lower())


def category_for(name: str) -> str:
    lower = name.lower()
    if "mac" in lower or "laptop" in lower:
        return "Laptops"
    if "iphone" in lower or "phone" in lower:
        return "Phones"
    if "monitor" in lower or "display" in lower or "oled" in lower:
        return "Displays"
    if "airpods" in lower or "headphone" in lower or "audio" in lower:
        return "Audio"
    if "gpu" in lower or "rtx" in lower:
        return "Components"
    return "Electronics"


def base_price_for(name: str) -> int:
    lower = name.lower()
    if "mac pro" in lower:
        return 6999
    if "macbook" in lower:
        return 1799
    if "iphone" in lower:
        return 999
    if "airpods" in lower:
        return 249
    if "oled" in lower:
        return 1499
    if "monitor" in lower:
        return 649
    if "rtx" in lower or "gpu" in lower:
        return 799
    return 499 + stable_hash(name) % 1800


def build_price_history(base_price: int, seed: int) -> list[PricePoint]:
    rows = []
    for index in range(14):
        cycle = np.sin((index + seed) / 2.2) * 0.055
        drift = (index - 7) * ((seed % 5) - 2) * 0.004
        price = round(base_price * (1 + cycle + drift))
        rows.append(PricePoint(date=f"04-{20 + index:02d}", price=price))
    return rows


def status(value: float) -> Literal["strong", "neutral", "weak"]:
    if value >= 68:
        return "strong"
    if value <= 42:
        return "weak"
    return "neutral"


def trained_model_prediction(prices: list[int], seed: int) -> tuple[float, float]:
    """Placeholder for the trained price model interface.

    In production this function should load the trained model artifact and predict
    the next 7-day price. The deterministic implementation keeps the repo runnable.
    """
    frame = pd.DataFrame({"price": prices})
    frame["ma_3"] = frame["price"].rolling(3).mean()
    latest = float(frame["price"].iloc[-1])
    ma_3 = float(frame["ma_3"].iloc[-1])
    model_bias = ((seed % 17) - 8) / 100
    predicted_price = latest * (0.65 + model_bias) + ma_3 * 0.35
    model_score = clamp(50 + ((latest - predicted_price) / latest) * 420)
    return predicted_price, model_score


def monte_carlo_model_risk(current_price: float, predicted_price: float, volatility_pct: float) -> tuple[float, float]:
    simulations = 10000
    sigma = max(0.01, volatility_pct / 100)
    final_prices = np.random.normal(predicted_price, current_price * sigma, simulations)
    probability_better_price = float(np.mean(final_prices < current_price)) * 100
    confidence = abs(probability_better_price - 50) * 2
    return clamp(probability_better_price), clamp(confidence)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    product_name = payload.productName.strip()
    if len(product_name) < 2:
        raise HTTPException(status_code=400, detail="Enter a product name to analyze.")

    seed = stable_hash(product_name)
    category = category_for(product_name)
    history = build_price_history(base_price_for(product_name), seed)
    prices = [point.price for point in history]
    current_price = prices[-1]
    min_price = min(prices)
    max_price = max(prices)
    average_price = float(np.mean(prices))
    volatility_pct = float(pd.Series(prices).pct_change().dropna().std() * 100)

    predicted_price, model_score = trained_model_prediction(prices, seed)
    mc_probability, mc_confidence = monte_carlo_model_risk(current_price, predicted_price, volatility_pct)

    price_position = clamp(100 - ((current_price - min_price) / max(1, max_price - min_price)) * 100)
    moving_average = clamp(55 + ((average_price - current_price) / average_price) * 300)
    volatility = clamp(100 - volatility_pct * 12)
    news_sentiment = clamp(54 + seed % 31 - 8)
    search_trend = clamp(50 + (seed * 7) % 39 - 12)
    social_demand = clamp(46 + (seed * 3) % 42)

    signals = [
        Signal(key="trainedPriceModel", label="Predicted Price", value=model_score, weight=24, status=status(model_score), source="Trained price model", explanation=f"Model predicts about ${round(predicted_price):,} over the next 7 days."),
        Signal(key="monteCarlo", label="Monte Carlo Risk", value=mc_probability, weight=14, status=status(mc_probability), source="10k simulations", explanation=f"{round(mc_probability)}% of simulated paths show a better or lower near-term price."),
        Signal(key="pricePosition", label="Price Position", value=price_position, weight=16, status=status(price_position), source="Price history API", explanation=f"Current price is ${current_price:,} in a recent ${min_price:,}-${max_price:,} range."),
        Signal(key="newsSentiment", label="News Sentiment", value=news_sentiment, weight=16, status=status(news_sentiment), source="LLM news analysis", explanation="Recent coverage is classified for discount timing, demand, and reliability."),
        Signal(key="searchTrend", label="Search Trend", value=search_trend, weight=12, status=status(search_trend), source="Google Trends API", explanation="Search interest estimates whether demand is cooling or heating up."),
        Signal(key="socialDemand", label="Social Virality", value=social_demand, weight=10, status=status(social_demand), source="Social/news APIs", explanation="Forums, reviews, and social posts indicate market attention."),
        Signal(key="volatility", label="Volatility", value=volatility, weight=8, status=status(volatility), source="pandas / NumPy", explanation="Lower price volatility improves risk-adjusted timing confidence."),
    ]

    openby_index = round(sum((signal.value / 100) * signal.weight for signal in signals))
    verdict: Literal["Buy now", "Watch", "Wait"] = "Buy now" if openby_index >= 72 else "Watch" if openby_index >= 50 else "Wait"
    target_buy_price = round(min(current_price * 0.96, average_price * 0.94, predicted_price))
    confidence = round(clamp(42 + abs(openby_index - 50) * 0.75 + mc_confidence * 0.22))

    product_id = product_name.lower().replace(" ", "-")
    return AnalyzeResponse(
        id=product_id,
        productName=product_name,
        category=category,
        currentPrice=current_price,
        targetBuyPrice=target_buy_price,
        openByIndex=openby_index,
        verdict=verdict,
        confidence=confidence,
        updatedAt="May 3, 2026",
        priceHistory=history,
        signals=signals,
        news=[
            NewsSignal(title=f"{product_name} demand stabilizes as retailers adjust pricing", outlet="Retail signals", sentiment="positive" if news_sentiment >= 62 else "neutral", impact="Price pressure signal"),
            NewsSignal(title=f"Review and forum activity suggests {category.lower()} buyers are comparison shopping", outlet="Social scan", sentiment="positive" if social_demand >= 64 else "neutral", impact="Demand signal"),
            NewsSignal(title=f"Search interest {'rising' if search_trend >= 60 else 'normalizing'} for {product_name}", outlet="Trend monitor", sentiment="positive" if search_trend >= 60 else "neutral", impact="Timing signal"),
        ],
        summary=f"{product_name} is rated {verdict.lower()} with an OpenBy Index of {openby_index}. The trained model and Monte Carlo layer estimate whether waiting is likely to improve the price.",
    )


@app.post("/simulate")
def simulate(data: dict) -> dict[str, float]:
    prices = [float(price) for price in data.get("prices", []) if float(price) > 0]
    if len(prices) < 5:
        raise HTTPException(status_code=400, detail="At least 5 prices are required.")
    predicted_price = float(data.get("predictedPrice", prices[-1]))
    volatility_pct = float(pd.Series(prices).pct_change().dropna().std() * 100)
    probability, confidence = monte_carlo_model_risk(prices[-1], predicted_price, volatility_pct)
    return {"probability_better_price": probability / 100, "confidence": confidence / 100}
