export async function runMonteCarlo(prices: number[]) {
  const configuredUrl = process.env.MONTE_CARLO_URL ?? "http://127.0.0.1:8000/simulate";
  const url = configuredUrl.endsWith("/simulate")
    ? configuredUrl
    : `${configuredUrl.replace(/\/$/, "")}/simulate`;

  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prices })
  });
  return res.json();
}
