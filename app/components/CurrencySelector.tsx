"use client";

import Select from "react-select";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { currencies, type Currency } from "./currencies";
import type { SingleValue } from "react-select";
import type { StylesConfig } from "react-select";



type CurrencySelectorProps = {
  value?: Currency;
  onCurrencyChange: (currency: Currency) => void;
  styles?:StylesConfig<Currency>;
};




export default function CurrencySelector({ value, onCurrencyChange }: CurrencySelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (selectedOption: SingleValue<Currency>) => {
    if (selectedOption) {
      onCurrencyChange(selectedOption);
    }
  };
  
  

  if (!mounted) return null;

  return (
      <Select
        value={value}
        onChange={(option) => onCurrencyChange(option as Currency)}
        options={currencies}
        isSearchable
        placeholder="Select currency..."
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "white",
            borderColor: "#d1d5db",
            borderRadius: "0.5rem",
            padding: "0.25rem",
            fontSize: "14px",
            minWidth: "180px",          // ✅ base width
            width: "fit-content",       // ✅ dynamic to content
            maxWidth: "90vw",           // ✅ mobile safe
          }),
          menu: (base) => ({
            ...base,
            width: "fit-content",       // ✅ dropdown fits text
            minWidth: "180px",
            maxWidth: "90vw",
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
            whiteSpace: "nowrap",       // ✅ single-line options
          }),
        }}
        
              />
  );
}
