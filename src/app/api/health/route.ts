export async function GET() {
  return Response.json({
    app: "OpenBy",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
