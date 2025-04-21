"use client";

import { useState } from "react";
import { currencies } from "../components/currencies";
import PGSelector from "../components/PGSelector";

export default function PostPage() {
  const [haveCurrency, setHaveCurrency] = useState("USD");
  const [haveAmount, setHaveAmount] = useState("");
  const [wantCurrency, setWantCurrency] = useState("EUR");
  const [wantAmount, setWantAmount] = useState("");
  const cryptoSymbols = ["BTC", "ETH", "USDT", "DOGE"];
  const [haveMethods, setHaveMethods] = useState<string[]>([]);
  const [wantMethods, setWantMethods] = useState<string[]>([]);

  // Exchange rate states
  const [useMarketRate, setUseMarketRate] = useState(false);
  const [customRate, setCustomRate] = useState("");

  const handleSubmit = () => {
    const have = parseFloat(haveAmount);
    const want = parseFloat(wantAmount);

    // Validate amounts
    if ((!have || have <= 0) && (!want || want <= 0)) {
      alert("Please input a positive amount you plan to trade with or trade for.");
      return;
    }

    // Validate exchange rate
    if (!useMarketRate) {
      const rateValue = parseFloat(customRate);
      if (!customRate || isNaN(rateValue) || rateValue <= 0) {
        alert("Please select Market Price or enter a valid exchange rate above zero.");
        return;
      }
    }

    const newPost = {
      haveCurrency,
      haveAmount,
      wantCurrency,
      wantAmount,
      haveMethods,
      wantMethods,
      exchangeRate: useMarketRate ? "market" : parseFloat(customRate),
      timestamp: Date.now(),
    };

    const existing = JSON.parse(localStorage.getItem("posts") || "[]");
    localStorage.setItem("posts", JSON.stringify([...existing, newPost]));

    alert("Your exchange offer has been posted!");
    // Reset form
    setHaveAmount("");
    setWantAmount("");
    setUseMarketRate(false);
    setCustomRate("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Create Exchange Offer</h1>

      <div className="bg-white/10 rounded-xl p-6 space-y-4">
        {/* What I Have */}
        <div>
          <label className="block mb-1">I have:</label>
          <select
            value={haveCurrency}
            onChange={(e) => setHaveCurrency(e.target.value)}
            className="w-full bg-white/20 rounded p-2 text-white"
          >
            {currencies.map((c) => (
              <option key={c.value} value={c.value}>
                {!cryptoSymbols.includes(c.value) ? c.symbol : ""} {c.value} {c.flag || ""}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={haveAmount}
            onChange={(e) => setHaveAmount(e.target.value)}
            className="w-full bg-white/20 mt-2 rounded p-2 text-white"
          />
        </div>

        {/* Payment Method */}
        <PGSelector selectedMethods={haveMethods} setSelectedMethods={setHaveMethods} />

        {/* What I Want */}
        <div>
          <label className="block mb-1">I want:</label>
          <select
            value={wantCurrency}
            onChange={(e) => setWantCurrency(e.target.value)}
            className="w-full bg-white/20 rounded p-2 text-white"
          >
            {currencies.map((c) => (
              <option key={c.value} value={c.value}>
                {!cryptoSymbols.includes(c.value) ? c.symbol : ""} {c.value} {c.flag || ""}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={wantAmount}
            onChange={(e) => setWantAmount(e.target.value)}
            className="w-full bg-white/20 mt-2 rounded p-2 text-white"
          />
        </div>

        {/* Payment Method */}
        <PGSelector selectedMethods={wantMethods} setSelectedMethods={setWantMethods} />

        {/* Exchange Rate */}
        <div>
          <label className="block mb-1">At:</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (useMarketRate) {
                  setUseMarketRate(false);
                } else {
                  setUseMarketRate(true);
                  setCustomRate("");
                }
              }}
              className={`px-4 py-2 rounded ${
                useMarketRate ? "bg-white text-purple-800" : "bg-purple-800 text-white"
              }`}
            >
              Market Price
            </button>
            <input
              type="number"
              min="0.00000001"
              step="any"
              placeholder="Custom rate"
              value={customRate}
              onChange={(e) => {
                setCustomRate(e.target.value);
                setUseMarketRate(false);
              }}
              disabled={useMarketRate}
              className={`bg-white/20 rounded p-2 text-white flex-1 ${
                useMarketRate ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 rounded p-3 mt-4 text-white font-semibold"
        >
          Post Offer
        </button>
      </div>
    </main>
  );
}
