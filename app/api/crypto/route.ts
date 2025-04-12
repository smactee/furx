
// app/api/crypto/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://cryptorates.ai/v1/price/${symbol}`);
    const text = await res.text();
    const price = parseFloat(text);

    if (isNaN(price)) {
      return NextResponse.json({ error: "Invalid price format" }, { status: 500 });
    }

    return NextResponse.json({ symbol, price });
  } catch (err) {
    console.error("Crypto API fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

  