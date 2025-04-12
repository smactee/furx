"use client";
//gang-gihuns-MacBook-Air:furx huni$ npm run dev


import { useState, useEffect, useRef } from "react";
import { Home, MessageCircle, Plus, Search, User, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CurrencySelector from "./components/CurrencySelector";
import { useExchangeRates, useCryptoRates } from "./hooks/useExchangeRates";
import { currencies, type Currency } from "./components/currencies";

const cryptoSymbols = ["BTC", "ETH", "USDT", "DOGE"];

export default function HomePage() {
  const updateBadge = (count: number) => {
    const badge = document.getElementById("noti-count");
    if (badge) {
      badge.textContent = count > 0 ? count.toString() : "";
    }
  };

  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [baseCurrency, setBaseCurrency] = useState<Currency>({
    label: "$ USD – US Dollar",
    symbol: "$",
    value: "USD",
    denomination: 1,
    flag: "🇺🇸",
  });

  const [amount, setAmount] = useState(baseCurrency.denomination);
  const [showPerCoin, setShowPerCoin] = useState(true);
  const [postBalances, setPostBalances] = useState<number[]>([]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let lastX = 0;
    let velocity = 0;
    let rafId: number;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.pageX;
      scrollLeft = el.scrollLeft;
      lastX = startX;
      el.classList.add("cursor-grabbing");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const x = e.pageX;
      const dx = x - lastX;
      lastX = x;
      velocity = dx;
      el.scrollLeft -= dx;
    };

    const onMouseUp = () => {
      isDragging = false;
      el.classList.remove("cursor-grabbing");
      animateMomentum();
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      scrollLeft = el.scrollLeft;
      lastX = startX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].clientX;
      const dx = x - lastX;
      lastX = x;
      velocity = dx;
      el.scrollLeft -= dx;
    };

    const onTouchEnd = () => {
      isDragging = false;
      animateMomentum();
    };

    const animateMomentum = () => {
      velocity *= 0.95;
      el.scrollLeft -= velocity;
      if (Math.abs(velocity) > 0.5) {
        rafId = requestAnimationFrame(animateMomentum);
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const balances = Array.from({ length: 20 }, () => Math.floor(Math.random() * 1000000));
    setPostBalances(balances);
  }, []);

  useEffect(() => {
    const syncBadge = () => {
      const saved = JSON.parse(localStorage.getItem("notifications") || "[]");
      updateBadge(saved.length);
    };

    syncBadge();
    window.addEventListener("storage", syncBadge);
    return () => window.removeEventListener("storage", syncBadge);
  }, []);

  const targetCurrencies = currencies.map((c) => c.value).filter((code) => code !== baseCurrency.value);

  const { rates: fiatRates, lastUpdated, nextUpdateInMinutes } = useExchangeRates(baseCurrency.value, targetCurrencies);
  const { rates: rawCryptoRates } = useCryptoRates("USD");

  const convertedCryptoRates = Object.fromEntries(
    Object.entries(rawCryptoRates).map(([symbol, priceInUSD]) => {
      if (baseCurrency.value === "USD") return [symbol, priceInUSD];
      const usdToBase = fiatRates?.["USD"];
      const priceInBase = usdToBase ? priceInUSD / usdToBase : priceInUSD;
      return [symbol, priceInBase];
    })
  );

  const dynamicRates = { ...(fiatRates || {}), ...(convertedCryptoRates || {}) };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#584175] to-[#422F53] p-6 text-white">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 relative">
        <h1 className="text-base font-bold tracking-wide">Für X Homepage</h1>
        <Link href="/notifications" className="relative block w-6 h-6">
  <Bell className="w-6 h-6 text-white" />
  <span
    id="noti-count"
    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full leading-none"
  >
    {/* badge count injected below */}
  </span>
</Link>

      </header>

      {/* MY STATISTICS */}
      <section className="mb-8 bg-[#1D1230] p-5 rounded-xl">
        <h2 className="text-lg font-bold mb-2">My Statistics</h2>
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-4 rounded-xl flex justify-between items-start">
          <div>
            <p className="text-gray-300 text-sm">Total Amount Exchanged</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <button className="bg-gray-200 text-black px-3 py-1 rounded-lg text-sm">My Posts</button>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400">Für X Credits</p>
          <p className="font-bold text-lg text-white">$420.00</p>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Recent Posts</h2>
          <Link href="/search" className="text-sm text-blue-400 hover:underline">View All</Link>
        </div>
        <div
  ref={scrollRef}
  className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
>
          <div className="flex gap-4 min-w-max">
            {postBalances.map((amount, i) => (
              <div
                key={i}
                className="min-w-[250px] bg-[#1D102D] rounded-xl p-4 border border-white/10 hover:border-purple-500 transition shrink-0"
              >
                <p className="text-white font-semibold mb-1">User {i + 1}</p>
                <p className="text-sm text-white/60 mb-2">has</p>
                <p className="text-2xl font-bold mb-1">₩{amount.toLocaleString()}</p>
                <p className="text-sm text-white/60">⇅ looking for</p>
                <p className="text-xl font-semibold mt-1">$USD</p>
                <button 
                  onClick={() => router.push(`/chats?user=User${i + 1}&amount=${amount}`)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded">
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <Link href="/search" className="text-sm text-blue-400 hover:underline">View All</Link> */}
      {/* CURRENCY RATES */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-1">
          <h2 className="text-lg font-bold">Currency Rates</h2>
          {lastUpdated && nextUpdateInMinutes !== null && (
            <p className="text-sm text-white/60 text-right">
              Updated at {lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · Next update in {nextUpdateInMinutes} minute{nextUpdateInMinutes === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-52">
            <CurrencySelector
              value={baseCurrency}
              onCurrencyChange={(currency) => {
                setBaseCurrency(currency);
                setAmount(currency.denomination);
              }}
            />
          </div>
          <input
            type="number"
            className="p-2 rounded-md text-black w-32"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={baseCurrency.denomination}
          />
          <button
            className="bg-white text-black px-4 py-2 rounded-lg text-sm"
            onClick={() => setShowPerCoin((prev) => !prev)}
          >
            {showPerCoin ? "Switch to Quote to Base" : "Switch to Base to Quote"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {currencies
            .filter((currency) => currency.value !== baseCurrency.value)
            .map((currency) => {
              const targetRate = dynamicRates?.[currency.value];
              const maxDecimal = cryptoSymbols.includes(currency.value) ? 6 : 4;
              const isCrypto = cryptoSymbols.includes(currency.value);

              const formatNumber = (num: number) => {
                if (isNaN(num)) return "--";
                return Number(num).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: maxDecimal,
                });
              };

              let convertedAmount = "--";
              if (typeof targetRate === "number" && typeof amount === "number") {
                const raw = showPerCoin
                  ? (isCrypto ? amount / targetRate : amount * targetRate)
                  : (isCrypto ? amount * targetRate : amount / targetRate);
                convertedAmount = formatNumber(raw);
              }

              return (
                <div key={currency.value} className="bg-[#1D102D] p-4 rounded-lg shadow-md">
                  <p className="text-sm text-white/60 mb-1">
                    {showPerCoin
                      ? `${!cryptoSymbols.includes(baseCurrency.value) ? baseCurrency.symbol : ""}${amount} ${baseCurrency.value} =`
                      : `${!cryptoSymbols.includes(currency.value) ? currency.symbol : ""}${amount} ${currency.value} = ${currency.flag || ""}`}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {showPerCoin
                      ? `${!cryptoSymbols.includes(currency.value) ? currency.symbol : ""}${convertedAmount} ${currency.value} ${currency.flag || ""}`
                      : `${!cryptoSymbols.includes(baseCurrency.value) ? baseCurrency.symbol : ""}${convertedAmount} ${baseCurrency.value} ${baseCurrency.flag || ""}`}
                  </p>
                </div>
              );
            })}
        </div>
      </section>

      {/* NAVIGATION */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/10 p-4 flex justify-around backdrop-blur-lg border-t border-white/20">
        <Link href="/"><Home /></Link>
        <Link href="/chats"><MessageCircle /></Link>
        <Link href="/post"><div className="bg-purple-500 p-4 rounded-full -mt-8 shadow-lg"><Plus /></div></Link>
        <Link href="/search"><Search /></Link>
        <Link href="/profile"><User /></Link>
      </nav>
    </main>
  );
}
