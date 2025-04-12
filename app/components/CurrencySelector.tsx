"use client";

import Select from "react-select";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { currencies, type Currency } from "./currencies";




type CurrencySelectorProps = {
  value?: Currency;
  onCurrencyChange: (currency: Currency) => void;
};



export default function CurrencySelector({ value, onCurrencyChange }: CurrencySelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (selectedOption: any) => {
    onCurrencyChange(selectedOption);
  };
  

  if (!mounted) return null;

  return (
    <div className="w-full">
      <select
  value={value?.value}
  onChange={(e) => {
    const selected = currencies.find(c => c.value === e.target.value);
    if (selected) onCurrencyChange(selected);
  }}
  className="..."
>
  {currencies.map((currency) => (
    <option key={currency.value} value={currency.value}>
      {currency.label}
    </option>
  ))}
</select>

    </div>
  );
}

