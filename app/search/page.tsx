"use client";

import { useEffect, useState } from "react";
import PGIcon from "../components/PGIcon";
import Link from "next/link";
import { Home, MessageCircle, Plus, Search, User } from "lucide-react";
import PullToRefreshLayout from "../components/PullToRefreshLayout";
import CurrencySelector from "../components/CurrencySelector";
import { currencies, type Currency } from "../components/currencies";
import type { StylesConfig, GroupBase, MultiValue } from "react-select";
import PGSelector from "../components/PGSelector";
import Select from "react-select";


type Post = {
  name: string;
  badges?: string[];
  mode: "online" | "offline";
  type: "buy" | "sell";
  trades: number;
  successRate: number;
  rating: number;
  quantity: number;
  limit: [number, number];
  haveCurrency: string;
  wantCurrency: string;
  exchangeRate: string | number;
  haveMethods: string[];
  wantMethods: string[];
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  responseTime?: number;
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

const currencyDropdownStyles: StylesConfig<Currency> = {
  control: (base) => ({
    ...base,
    display: "inline-block", // 👈 key to make it wrap content
    width: "auto",            // 👈 allow natural content width
    minWidth: "160px",        // 👈 optional: minimum for readability
    maxWidth: "100%",         // 👈 responsive cap
    padding: "0.25rem",
    fontSize: "14px",
    borderColor: "#d1d5db",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6b21a8"
      : state.isFocused
      ? "#f3e8ff"
      : "white",
    color: state.isSelected ? "white" : "#111827",
    fontSize: "14px",
  }),
};

//  Coordinates for the user's location Haversine formula

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


const mockData: Post[] = [
  {
    name: "GlobalTradeSource",
    badges: ["🏆", "🕒"],
    type: "buy",
    mode: "online",
    trades: 1243,
    successRate: 99.8,
    rating: 87.68,
    quantity: 97.83,
    limit: [100, 8577.73],
    haveCurrency: "USD",
    wantCurrency: "THB",
    exchangeRate: "market",
    city: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
    haveMethods: ["Alipay", "Wechat Pay", "Wise", "Stripe"],
    wantMethods: ["Wire Transfer", "Paypal"],
    responseTime: 30,
    
  },
  {
    name: "chistiyi",
    badges: ["💰", "🔥"],
    type: "sell",
    mode: "online",
    trades: 232,
    successRate: 86.3,
    rating: 87.69,
    quantity: 88.03,
    limit: [100, 7367],
    haveCurrency: "CNY",
    wantCurrency: "USD",
    exchangeRate: "market",
    city: "Chengdu",
    country: "China",
    latitude: 30.5728,
    longitude: 104.0668,
    haveMethods: ["Wechat Pay", "Wire Transfer", "Alipay", "Bitcoin"],
    wantMethods: ["Paypal", "Stripe"],
    responseTime: 69,
  },
  {
    name: "manu07",
    badges: ["🕒", "🌍"],
    type: "buy",
    mode: "offline",
    trades: 412,
    successRate: 94.1,
    rating: 87.7,
    quantity: 27.38,
    limit: [100, 2401.22],
    haveCurrency: "USDT",
    wantCurrency: "JPY",
    exchangeRate: "market",
    city: "Seoul",
    country: "South Korea",
    latitude: 37.5665,
    longitude: 126.978,
    haveMethods: ["Alipay", "Wire Transfer", "Paypal", "Skrill"],
    wantMethods: ["Stripe", "Wise"],
    responseTime: 420,
  },
  {
    name: "QuickPayZelle",
    badges: ["💰", "🏆"],
    type: "sell",
    mode: "online",
    trades: 560,
    successRate: 97.2,
    rating: 92.5,
    quantity: 300,
    limit: [100, 5000],
    haveCurrency: "KRW",
    wantCurrency: "USD",
    exchangeRate: "market",
    city: "Chicago",
    country: "United States",
    latitude: 41.8781,
    longitude: -87.6298,
    haveMethods: ["Zelle", "Stripe", "Paypal"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 12,
  },
  {
    name: "HKSwift",
    badges: ["🌍", "🔥"],
    type: "buy",
    mode: "offline",
    trades: 310,
    successRate: 88.3,
    rating: 81.4,
    quantity: 190,
    limit: [50, 2500],
    haveCurrency: "BTC",
    wantCurrency: "USD",
    exchangeRate: "market",
    city: "Hong Kong",
    country: "China",
    latitude: 22.3193,
    longitude: 114.1694,
    haveMethods: ["Alipay", "Wechat Pay", "Wire Transfer"],
    wantMethods: ["Paypal", "Stripe"],
    responseTime: 35,
  },
  {
    name: "LagosLoop",
    type: "sell",
    mode: "online",
    trades: 430,
    successRate: 90.7,
    rating: 85.2,
    quantity: 220,
    limit: [80, 4000],
    haveCurrency: "USD",
    wantCurrency: "BTC",
    exchangeRate: "market",
    city: "Lagos",
    country: "Nigeria",
    latitude: 6.5244,
    longitude: 3.3792,
    haveMethods: ["Wise", "Paypal"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 20,
  },
  {
    name: "BerlinXfer",
    badges: ["🏆"],
    type: "buy",
    mode: "online",
    trades: 720,
    successRate: 99.1,
    rating: 95.4,
    quantity: 560,
    limit: [200, 7000],
    haveCurrency: "USD",
    wantCurrency: "EUR",
    exchangeRate: "market",
    city: "Berlin",
    country: "Germany",
    latitude: 52.52,
    longitude: 13.405,
    haveMethods: ["Revolut", "Wire Transfer", "Stripe"],
    wantMethods: ["Paypal", "Alipay"],
    responseTime: 7,
  },
  {
    name: "VenmoQueen",
    badges: ["🏆", "🕒", "💰"],
    type: "sell",
    mode: "offline",
    trades: 130,
    successRate: 83.9,
    rating: 78.3,
    quantity: 100,
    limit: [20, 1500],
    haveCurrency: "CAD",
    wantCurrency: "EUR",
    exchangeRate: "market",
    city: "Atlanta",
    country: "United States",
    latitude: 33.749,
    longitude: -84.388,
    haveMethods: ["Venmo", "Cash App"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 55,
  },
  {
    name: "StripeSecure",
    badges: ["🌍"],
    type: "buy",
    mode: "online",
    trades: 845,
    successRate: 98.4,
    rating: 94.2,
    quantity: 670,
    limit: [150, 8500],
    haveCurrency: "CNY",
    wantCurrency: "USD",
    exchangeRate: "market",
    city: "Toronto",
    country: "Canada",
    latitude: 43.65107,
    longitude: -79.347015,
    haveMethods: ["Stripe", "Apple Pay", "Google Pay"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 10,
  },
  {
    name: "ZelleTime",
    badges: ["🏆"],
    type: "sell",
    mode: "online",
    trades: 410,
    successRate: 93.5,
    rating: 90.8,
    quantity: 360,
    limit: [100, 4500],
    haveCurrency: "USD",
    wantCurrency: "CNY",
    exchangeRate: "market",
    city: "Phoenix",
    country: "United States",
    latitude: 33.4484,
    longitude: -112.074,
    haveMethods: ["Zelle", "Razor Pay"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 18,
  },
  {
    name: "NairobiChain",
    badges: ["🕒", "🌍"],
    type: "buy",
    mode: "offline",
    trades: 290,
    successRate: 86.1,
    rating: 80.5,
    quantity: 180,
    limit: [70, 3000],
    haveCurrency: "USD",
    wantCurrency: "DOGE",
    exchangeRate: "market",
    city: "Nairobi",
    country: "Kenya",
    latitude: -1.2921,
    longitude: 36.8219,
    haveMethods: ["Ethereum", "Bitcoin", "Wire Transfer"],
    wantMethods: ["Paypal", "Stripe"],
    responseTime: 40,
  },
  {
    name: "WiseOne",
    badges: ["💰", "🔥"],
    type: "sell",
    mode: "online",
    trades: 580,
    successRate: 96.3,
    rating: 91.6,
    quantity: 330,
    limit: [90, 5000],
    haveCurrency: "ETH",
    wantCurrency: "USD",
    exchangeRate: "market",
    city: "Bangkok",
    country: "Thailand",
    latitude: 13.7563,
    longitude: 100.5018,
    haveMethods: ["Wise", "Paypal", "Stripe"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 14,
  },
  {
    name: "SkrillFlash",
    badges: ["💰", "🔥", "🕒"],
    type: "buy",
    mode: "online",
    trades: 345,
    successRate: 89.9,
    rating: 84.3,
    quantity: 250,
    limit: [60, 4200],
    haveCurrency: "USD",
    wantCurrency: "USDT",
    exchangeRate: "market",
    city: "Istanbul",
    country: "Turkey",
    latitude: 41.0082,
    longitude: 28.9784,
    haveMethods: ["Skrill", "Paypal", "Stripe"],
    wantMethods: ["Wire Transfer", "Alipay"],
    responseTime: 25,
  }
  
];

export default function SearchPage() {
  const [typeFilter, setTypeFilter] = useState<"buy" | "sell">("buy");
  const [tradeMode, setTradeMode] = useState<"online" | "offline" | "all">("all");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [postBalances, setPostBalances] = useState<number[]>([]);

  
  type SortOption = { label: string; value: string };
  const sortOptions = [
    { label: "🟢 Currently Online", value: "online" },
    { label: "📍 Nearest", value: "nearest" },
    { label: "⏱ Response Time", value: "responseTime" },
    { label: "🏙 Same City", value: "sameCity" },
    { label: "✅ Success Rate", value: "successRate" },
    { label: "⭐ Rating", value: "rating" },
    { label: "↓ Min. Price", value: "minPrice" },
    { label: "↑ Max Price", value: "maxPrice" },
    { label: "🌍 Same Country", value: "sameCountry" },
  ];
  
 
  const [sortBy, setSortBy] = useState<string[]>([]);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Get user profile from local storage
  const [userProfile, setUserProfile] = useState<{ city: string; currentCountry: string }>({ city: "", currentCountry: "" });

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    setUserProfile({
      city: profile.city || "",
      currentCountry: profile.currentCountry || "",
    });
  }, []);
  

const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }
}, []);

useEffect(() => {
  const balances = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10000));
  setPostBalances(balances);
}, []);



  return (
    <>
      <PullToRefreshLayout>
        <main className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-100 p-4 pb-32 text-black">
          <h1 className="text-xl font-bold mb-4">Search Posts</h1>

{/* Filter Controls */}
<div className="mb-4 space-y-3 text-sm">

  {/* Buy / Sell */}
  <div className="flex gap-2">
    <button
      onClick={() => setTypeFilter("buy")}
      className={`px-4 py-1 rounded-full ${
        typeFilter === "buy" ? "bg-black text-white" : "bg-white border border-gray-300 text-black"
      }`}
    >
      Buy
    </button>
    <button
      onClick={() => setTypeFilter("sell")}
      className={`px-4 py-1 rounded-full ${
        typeFilter === "sell" ? "bg-black text-white" : "bg-white border border-gray-300 text-black"
      }`}
    >
      Sell
    </button>
  </div>

  {/* Online / Offline / All */}
  <div className="flex gap-2">
    {["all", "online", "offline"].map((mode) => (
      <button
        key={mode}
        onClick={() => setTradeMode(mode as "all" | "online" | "offline")}
        className={`px-4 py-1 rounded-full ${
          tradeMode === mode
            ? "bg-black text-white"
            : "bg-white border border-gray-300 text-black"
        }`}
      >
        {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </button>
    ))}
  </div>
  </div>

  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2">
  {/* Currency Selector */}
  <CurrencySelector
    value={selectedCurrency}
    onCurrencyChange={setSelectedCurrency}
    styles={currencyDropdownStyles}
  />

  {/* PGSelector - Payment Methods Multi Select */}
  <div className="w-full sm:w-[300px] mt-2 sm:mt-0">
    <PGSelector
      selectedMethods={selectedMethods}
      setSelectedMethods={setSelectedMethods}
    />
  </div>
  {/* Sort Options */}
  <div className="w-full sm:w-[240px] mt-2 sm:mt-0">
  {mounted && (
<Select
    isMulti
    options={sortOptions}
    placeholder="Sort by..."
    classNamePrefix="react-select"
    value={sortOptions.filter((opt) => sortBy.includes(opt.value))}
    onChange={(vals: MultiValue<SortOption>) => {
      setSortBy(vals.map((val) => val.value)); }}
    
    styles={{
      control: (base) => ({
        ...base,
        backgroundColor: "white",
        borderColor: "#d1d5db",
        borderRadius: "0.5rem",
        padding: "0.25rem",
        fontSize: "14px",
        minHeight: "42px",
      }),
      option: ( base, state)=> ({
        ...base,
        backgroundColor: state.isSelected
          ? "#6b21a8"
          : state.isFocused
          ? "#f3e8ff"
          : "white",
        color: "#111827",
        fontSize: "14px",
      }),
    }}
  />
  )}
</div>

</div>






          {/* Filter List */}
          <div className="space-y-4">
          {mockData
  .filter((item) => item.type === typeFilter)
  .filter((item) => tradeMode === "all" || item.mode === tradeMode)
  .filter((item) => selectedCurrency && (item.haveCurrency === selectedCurrency.value || item.wantCurrency === selectedCurrency.value))
  .filter(
    (item) =>
      selectedMethods.length === 0 ||
      item.haveMethods?.some((method) => selectedMethods.includes(method)) ||
      item.wantMethods?.some((method) => selectedMethods.includes(method))
  )
    .sort((a, b) => {
      // Always apply these high-priority fallbacks even if no filters selected
  const aOnline = a.mode === "online";
  const bOnline = b.mode === "online";
  if (aOnline !== bOnline) return Number(bOnline) - Number(aOnline);

  // ...then apply other filters only if selected
  if (sortBy.includes("responseTime") && a.responseTime !== undefined && b.responseTime !== undefined)
    return a.responseTime - b.responseTime;
  
    // 2. Closest to user
    if (
      sortBy.includes("nearest") &&
      a.latitude && a.longitude &&
      b.latitude && b.longitude &&
      userLocation
    ) {
      const distA = getDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
      const distB = getDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
      return distA - distB;
    }
  
    // 3. Fastest response
    if (
      sortBy.includes("responseTime") &&
      a.responseTime !== undefined &&
      b.responseTime !== undefined
    ) {
      return a.responseTime - b.responseTime;
    }
  
    // 4. Same city
    if (sortBy.includes("sameCity")) {
      const aMatch = a.city?.toLowerCase() === userProfile.city.toLowerCase();
      const bMatch = b.city?.toLowerCase() === userProfile.city.toLowerCase();
      if (aMatch !== bMatch) return Number(bMatch) - Number(aMatch);
    }
  
    // 5. Success rate
    if (sortBy.includes("successRate")) return b.successRate - a.successRate;
  
    // 6. Rating
    if (sortBy.includes("rating")) return b.rating - a.rating;
  
    // 7. Min price (lower is better)
    if (sortBy.includes("minPrice")) return a.limit[0] - b.limit[0];
  
    // 8. Max price (higher is better)
    if (sortBy.includes("maxPrice")) return b.limit[1] - a.limit[1];
  
    // 9. Same country
    if (sortBy.includes("sameCountry")) {
      const aMatch = a.country?.toLowerCase() === userProfile.currentCountry.toLowerCase();
      const bMatch = b.country?.toLowerCase() === userProfile.currentCountry.toLowerCase();
      if (aMatch !== bMatch) return Number(bMatch) - Number(aMatch);
    }
  
    return 0;
  })
  
  
  .map((item, index) => (

  <div
    key={index}
    className="bg-white p-4 rounded-md shadow border border-gray-200 space-y-3"
  >
    {/* Top row: name + badge + successRate */}
<div className="flex items-start justify-between">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
      {item.name[0].toUpperCase()}
    </div>
    <div className="text-sm font-medium text-gray-800">{item.name}</div>
    {item.badges?.map((badge, idx) => (
      <span
        key={idx}
        className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-400"
      >
        {badge}
      </span>
    ))}
  </div>

  {/* Right column: success rate + response time stacked */}
  <div className="text-right text-[11px] text-gray-500 space-y-1">
    <div>{item.successRate}% Success Rate</div>
    <div className="flex items-center justify-end gap-1 text-xs">
      ⏱ <span>{item.responseTime} min</span>
    </div>
  </div>
</div>


    {/* Rate + quantity + limit */}
    <div className="space-y-1">
    <div className="text-xl font-bold text-green-600">
  ${postBalances[index]?.toLocaleString()}{" "}
  <span className="text-sm font-normal text-gray-600">{item.haveCurrency}</span>
</div>

<div className="text-[12px] text-gray-500">
  Rate: {item.exchangeRate === "market" ? "Market Rate" : item.exchangeRate}
</div>

      <div className="text-[12px] text-gray-500">
      Minimum Transaction Amount: ${item.limit[0].toLocaleString()}
      </div>
    </div>

{/* Sending In */}
<div className="mt-3">
{(() => {
  const currency = currencies.find(c => c.value === item.haveCurrency);
  return (
    <div className="text-sm font-normal text-gray-600 mb-1 flex items-center gap-1">
      {currency?.flag && <span>{currency.flag}</span>}
      {currency?.symbol} {item.haveCurrency} – Sending in:
    </div>
  );
})()}

  <div className="flex flex-wrap gap-2">
    {item.haveMethods?.map((method: string, i: number) => (
      <PGIcon key={`send-${i}`} type={method} />
    ))}
  </div>
</div>

{/* Wanting In */}
<div className="mt-3">
{(() => {
  const currency = currencies.find(c => c.value === item.wantCurrency);
  return (
    <div className="text-sm font-normal text-gray-600 mb-1 flex items-center gap-1">
      {currency?.flag && <span>{currency.flag}</span>}
      {currency?.symbol} {item.wantCurrency} – Wanting in:
    </div>
  );
})()}


  <div className="flex flex-wrap gap-2">
    {item.wantMethods?.map((method: string, i: number) => (
      <PGIcon key={`want-${i}`} type={method} />
    ))}
  </div>
</div>


    {/* Action=bottom row */}
<div className="flex justify-end items-center mt-3">
  <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md">
    Chat
  </button>
</div>

  </div>
))}

          </div>
        </main>
      </PullToRefreshLayout>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-b from-[#584175] to-[#422F53] p-4 flex justify-around border-t border-white/20 z-50">
        <Link href="/"><Home /></Link>
        <Link href="/chats"><MessageCircle /></Link>
        <Link href="/post">
          <div className="bg-purple-500 p-4 rounded-full -mt-8 shadow-lg">
            <Plus />
          </div>
        </Link>
        <Link href="/search"><Search /></Link>
        <Link href="/profile"><User /></Link>
      </nav>
    </>
  );



}
