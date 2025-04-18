"use client";

import { useEffect, useState } from "react";

// ───── CONSTANTS ─────
const FIAT_URL = "https://hexarate.paikama.co/api/rates/latest";
const SUPPORTED_CRYPTOS = ["USDT", "BTC", "ETH", "DOGE"];

// ───── TYPES ─────
type RateMap = Record<string, number>;

// ───── CACHING ─────
let usdRateCache: { rates: RateMap; timestamp: number } | null = null;
let cryptoRateCache: { rates: RateMap; timestamp: number } | null = null;

// ───── MAIN HOOK: FIAT RATES ─────
export function useExchangeRates(baseCurrency: string, targetCurrencies: string[]) {
  const [rates, setRates] = useState<RateMap>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);
  const [nextUpdateInMinutes, setNextUpdateInMinutes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUSDBaseRates = async () => {
    const now = new Date();
    const topOfHour = new Date(now);
    topOfHour.setMinutes(0, 0, 0);

    if (usdRateCache && usdRateCache.timestamp >= topOfHour.getTime()) {
      return usdRateCache;
    }

    const fetchedRates: RateMap = { USD: 1 };

    await Promise.all(
      Array.from(new Set([...targetCurrencies, baseCurrency]))
        .filter((cur) => cur !== "USD" && !SUPPORTED_CRYPTOS.includes(cur))
        .map(async (target) => {
          try {
            const res = await fetch(`${FIAT_URL}/USD?target=${target}`);
            const data = await res.json();
            if (data?.data?.mid) {
              fetchedRates[target] = data.data.mid;
            }
          } catch (err) {
            console.error(`Failed to fetch USD to ${target}`, err);
          }
        })
    );

    const timestamp = topOfHour.getTime();
    usdRateCache = { rates: fetchedRates, timestamp };
    return usdRateCache;
  };

  const calculateRatesFromBase = (base: string, usdRates: RateMap) => {
    const calculated: RateMap = {};
    const baseRate = usdRates[base] || 1;

    for (const [target, targetRate] of Object.entries(usdRates)) {
      if (target !== base) {
        calculated[target] = targetRate / baseRate;
      }
    }

    return calculated;
  };

  useEffect(() => {
    const updateRates = async () => {
      setIsLoading(true);
      const usdCache = await fetchUSDBaseRates();
      const converted = calculateRatesFromBase(baseCurrency, usdCache.rates);
      setRates(converted);
      setLastUpdated(new Date(usdCache.timestamp));
      setIsLoading(false);
    };

    updateRates();
  }, [baseCurrency, targetCurrencies.join(",")]);

  useEffect(() => {
    if (!lastUpdated) return;

    const updateRelative = () => {
      const now = new Date();
      const minutesSince = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000);
      const minutesUntilNextHour = 60 - minutesSince;

      setMinutesAgo(minutesSince);
      setNextUpdateInMinutes(minutesUntilNextHour);
    };

    updateRelative();
    const interval = setInterval(updateRelative, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated?.getTime()]);

  useEffect(() => {
    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      usdRateCache = null;
      fetchUSDBaseRates().then((usdCache) => {
        const converted = calculateRatesFromBase(baseCurrency, usdCache.rates);
        setRates(converted);
        setLastUpdated(new Date(usdCache.timestamp));
      });
    }, msUntilNextHour);

    return () => clearTimeout(timeout);
  }, [baseCurrency, targetCurrencies.join(",")]);

  return { rates, lastUpdated, minutesAgo, nextUpdateInMinutes, isLoading};
}



// ───── CRYPTO RATES HOOK ─────
export function useCryptoRates(baseCurrency: string) {
  const [rates, setRates] = useState<RateMap>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);
  const [nextUpdateInMinutes, setNextUpdateInMinutes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCryptoRates = async () => {
    const now = new Date();
    const topOfHour = new Date(now);
    topOfHour.setMinutes(0, 0, 0);

    if (cryptoRateCache && cryptoRateCache.timestamp >= topOfHour.getTime()) {
      return cryptoRateCache;
    }

    const fetchedRates: Record<string, number> = { USD: 1 };

    await Promise.all(
      SUPPORTED_CRYPTOS.map(async (symbol) => {
        try {
          const res = await fetch(`/api/crypto?symbol=${symbol}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          if (data?.price) {
            const price = parseFloat(data.price);
            if (!isNaN(price)) {
              fetchedRates[symbol] = price;
            }
          }
        } catch (err) {
          console.error(`Failed to fetch crypto price for ${symbol}:`, err);
        }
      })
    );

    const timestamp = topOfHour.getTime();
    cryptoRateCache = { rates: fetchedRates, timestamp };
    return cryptoRateCache;
  };

  const calculateFromBase = (base: string, usdRates: RateMap) => {
    const converted: RateMap = {};
    const baseRate = usdRates[base] || 1;

    for (const [symbol, priceInUSD] of Object.entries(usdRates)) {
      if (symbol !== base) {
        converted[symbol] = priceInUSD / baseRate;
      }
    }

    return converted;
  };

  useEffect(() => {
    const updateRates = async () => {
      setIsLoading(true);
      const cache = await fetchCryptoRates();
      const converted = calculateFromBase(baseCurrency, cache.rates);
      setRates(converted);
      setLastUpdated(new Date(cache.timestamp));
      setIsLoading(false);
    };

    updateRates();
  }, [baseCurrency]);

  useEffect(() => {
    if (!lastUpdated) return;

    const updateRelativeTime = () => {
      const now = new Date();
      const minutesSince = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000);
      const minutesUntilNextHour = 60 - minutesSince;

      setMinutesAgo(minutesSince);
      setNextUpdateInMinutes(minutesUntilNextHour);
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated?.getTime()]);

  useEffect(() => {
    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      cryptoRateCache = null;
      fetchCryptoRates().then((cache) => {
        const converted = calculateFromBase(baseCurrency, cache.rates);
        setRates(converted);
        setLastUpdated(new Date(cache.timestamp));
      });
    }, msUntilNextHour);

    return () => clearTimeout(timeout);
  }, [baseCurrency]);

  return { rates, lastUpdated, minutesAgo, nextUpdateInMinutes, isLoading };
}