"use client";

import { useEffect, useState } from "react";
import PGIcon from "../components/PGIcon";
import Link from "next/link";
import { Home, MessageCircle, Plus, Search, User } from "lucide-react";
import PullToRefreshLayout from "../components/PullToRefreshLayout";
import CurrencySelector from "../components/CurrencySelector";
import { currencies, type Currency } from "../components/currencies"; // ✅ already in place
import type { StylesConfig, GroupBase, MultiValue } from "react-select";
import PGSelector from "../components/PGSelector";
import Select from "react-select";

type Post = {
  name: string;
  mode: "online" | "offline";
  type: "buy" | "sell";
  trades: number;
  successRate: number;
  rating: number;
  quantity: number;
  limit: [number, number];
  currency: string;
  paymentMethods: string[];
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
    type: "buy",
    mode: "online",
    trades: 1243,
    successRate: 99.8,
    rating: 87.68,
    quantity: 97.83,
    limit: [100, 8577.73],
    currency: "USD",
    city: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
    paymentMethods: ["Alipay", "Wechat Pay", "Wise", "Stripe"],
    responseTime: 30,
  },
  {
    name: "chistiyi",
    type: "sell",
    mode: "online",
    trades: 232,
    successRate: 86.3,
    rating: 87.69,
    quantity: 88.03,
    limit: [100, 7367],
    currency: "USD",
    city: "Chengdu",
    country: "China",
    latitude: 30.5728,
    longitude: 104.0668,
    paymentMethods: ["Wechat Pay", "Wire Transfer", "Alipay", "Bitcoin"],
    responseTime: 69,
  },
  {
    name: "manu07",
    type: "buy",
    mode: "offline",
    trades: 412,
    successRate: 94.1,
    rating: 87.7,
    quantity: 27.38,
    limit: [100, 2401.22],
    currency: "USD",
    city: "Seoul",
    country: "South Korea",
    latitude: 37.5665,
    longitude: 126.978,
    paymentMethods: ["Alipay", "Wire Transfer", "Paypal", "Skrill"],
    responseTime: 420,
  },
];

export default function SearchPage() {
  const [typeFilter, setTypeFilter] = useState<"buy" | "sell">("buy");
  const [tradeMode, setTradeMode] = useState<"online" | "offline" | "all">("all");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  
  type SortOption = { label: string; value: string };
  const sortOptions = [
    { label: "Currently Online", value: "online" },
    { label: "Min Price", value: "minPrice" },
    { label: "Max Price", value: "maxPrice" },
    { label: "Nearest", value: "nearest" },
    { label: "Same City", value: "sameCity" },
    { label: "Same Country", value: "sameCountry" },
    { label: "Rating", value: "rating" },
    { label: "Success Rate", value: "successRate" },
    { label: "Response Time", value: "responseTime" },
  ];
  const [sortBy, setSortBy] = useState<string[]>([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Get user profile from local storage
const [userCity, setUserCity] = useState("");
const [userCountry, setUserCountry] = useState("");

useEffect(() => {
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  setUserCity(profile.city || "");
  setUserCountry(profile.currentCountry || ""); 
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
  .filter((item) => selectedCurrency && item.currency === selectedCurrency.value)
  .filter((item) => selectedMethods.length === 0 || item.paymentMethods.some((method) => selectedMethods.includes(method)))
  .sort((a, b) => {
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
if (sortBy.includes("rating")) return b.rating - a.rating;
    if (sortBy.includes("trades")) return b.trades - a.trades;
    if (
      sortBy.includes("responseTime") &&
      a.responseTime !== undefined &&
      b.responseTime !== undefined
    ) {
      return a.responseTime - b.responseTime;
    }
      
    // Sort by online status, city, and country    
if (sortBy.includes("online")) {
      const aOnline = a.mode === "online";
      const bOnline = b.mode === "online";
      if (aOnline !== bOnline) return Number(bOnline) - Number(aOnline);
    }    
    if (sortBy.includes("sameCity")) {
      const aMatch = a.city?.toLowerCase() === userCity.toLowerCase();
      const bMatch = b.city?.toLowerCase() === userCity.toLowerCase();
      if (aMatch !== bMatch) return Number(bMatch) - Number(aMatch);
    }
  
    if (sortBy.includes("sameCountry")) {
      const aMatch = a.country?.toLowerCase() === userCountry.toLowerCase();
      const bMatch = b.country?.toLowerCase() === userCountry.toLowerCase();
      if (aMatch !== bMatch) return Number(bMatch) - Number(aMatch);
    }
  
    if (sortBy.includes("minPrice")) return a.rating - b.rating;
    if (sortBy.includes("maxPrice")) return b.rating - a.rating;
    if (sortBy.includes("successRate")) return b.successRate - a.successRate;
  
    return 0;
  })
  
  .map((item, index) => (

  <div
    key={index}
    className="bg-white p-4 rounded-md shadow border border-gray-200 space-y-3"
  >
    {/* Top row: name + badge + successRate */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
          {item.name[0].toUpperCase()}
        </div>
        <div className="text-sm font-medium text-gray-800">{item.name}</div>
        <span className="text-[10px] bg-yellow-300 text-yellow-900 font-semibold px-1.5 py-0.5 rounded">
          Pro
        </span>
        <span className="text-[10px] bg-red-100 text-yellow-800 px-1 py-0.5 rounded border border-yellow-400">
        ✗ Not Verified
        </span>
      </div>
      <div className="text-[11px] text-gray-500">{item.successRate}% Success Rate</div>
    </div>

    {/* Rate + quantity + limit */}
    <div className="space-y-1">
      <div className="text-xl font-bold text-green-600">
        ${item.rating} <span className="text-sm font-normal text-gray-600">USD</span>
      </div>
      <div className="text-[12px] text-gray-500">Available: {item.quantity.toLocaleString()} USDT</div>
      <div className="text-[12px] text-gray-500">
        Min. E✗change Limit: ${item.limit[0].toLocaleString()} – ${item.limit[1].toLocaleString()}
      </div>
    </div>

    {/* Payment methods — with PGIcon */}
    <div className="mt-3 flex flex-wrap gap-2">
      {item.paymentMethods.map((method, i) => (
        <PGIcon key={i} type={method} />
      ))}
    </div>

    {/* Action row */}
    <div className="flex justify-between items-center mt-3">
      <div className="text-xs text-gray-500 flex items-center gap-1">
        ⏱ <span>30 min</span>
      </div>
      <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md">
        Buy USDT
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
