type ScoreInput = {
  trend: number;
  sentiment: number;
  momentum: number;
  volatility: number;
  monteCarloProb: number;
};

export function computeScore({trend, sentiment, momentum, volatility, monteCarloProb}: ScoreInput) {
  const score =
    0.4 * trend +
    0.2 * sentiment +
    0.2 * momentum +
    0.2 * monteCarloProb * 100;

  const confidence =
    0.5 * Math.abs(monteCarloProb - 0.5) * 2 +
    0.5 * (1 - volatility / 100);

  return {
    score: Math.round(score),
    confidence
  };
}
