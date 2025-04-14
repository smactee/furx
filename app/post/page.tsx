// app/chats/page.tsx

  "use client";

import { useState } from "react";
import {currencies, type Currency} from "../components/currencies";
import PGSelector from "../components/PGSelector";




export default function PostPage() {
  const [haveCurrency, setHaveCurrency] = useState("USD");
  const [haveAmount, setHaveAmount] = useState("");
  const [wantCurrency, setWantCurrency] = useState("EUR");
  const [wantAmount, setWantAmount] = useState("");
  const cryptoSymbols = ["BTC", "ETH", "USDT", "DOGE"];
  const [haveMethods, setHaveMethods] = useState<string[]>([]);
  const [wantMethods, setWantMethods] = useState<string[]>([]);
  


  const handleSubmit = () => {
    const have = parseFloat(haveAmount);
    const want = parseFloat(wantAmount);
  
    // Check that at least one is a valid positive number
    if ((!have || have <= 0) && (!want || want <= 0)) {
      alert("Please input a positive amount you plan to trade with or trade for.");
      return;
    }
  
    const newPost = {
      haveCurrency,
      haveAmount,
      wantCurrency,
      wantAmount,
      haveMethods,
      wantMethods,
      timestamp: Date.now(),
    };
  
    const existing = JSON.parse(localStorage.getItem("posts") || "[]");
    localStorage.setItem("posts", JSON.stringify([...existing, newPost]));
  
    alert("Your exchange offer has been posted!");
    setHaveAmount("");
    setWantAmount("");
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
    {`${!cryptoSymbols.includes(c.value) ? c.symbol : ""} ${c.value} ${c.flag || ""}`}
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
<PGSelector
  label="In:"
  selectedMethods={haveMethods}
  setSelectedMethods={setHaveMethods}
/>




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
    {`${!cryptoSymbols.includes(c.value) ? c.symbol : ""} ${c.value} ${c.flag || ""}`}
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
<PGSelector
  label="In:"
  selectedMethods={wantMethods}
  setSelectedMethods={setWantMethods}
/>



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
