import type { NextRequest } from "next/server";

const API_BASE = "https://duae-api-production.up.railway.app/api/services";

async function proxy(request: NextRequest, url: string) {
  const response = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: request.method === "GET" ? undefined : await request.text(),
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET(request: NextRequest) {
  return proxy(request, API_BASE);
}

export async function POST(request: NextRequest) {
  return proxy(request, API_BASE);
}
