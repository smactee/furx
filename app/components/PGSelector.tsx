"use client";

import Select, { MultiValue, StylesConfig } from "react-select";
import { useEffect, useState } from "react";
import PGIcon from "./PGIcon";

type PGSelectorProps = {
  selectedMethods: string[];
  setSelectedMethods: (methods: string[]) => void;
};

const allMethods = [
  "Apple Pay", "Alipay", "Bitcoin", "Cash App", "Ethereum", "Google Pay",
  "Paypal", "Razor Pay", "Revolut", "Samsung Pay", "Stripe", "Skrill",
  "USDT Tether", "Venmo", "Wechat Pay", "Wire Transfer", "Wise", "Zelle",
];

// convert to react-select format
const methodOptions = allMethods.map((method) => ({
  label: method,
  value: method,
}));

export default function PGSelector({
  selectedMethods,
  setSelectedMethods,
}: PGSelectorProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full">

      <Select
        isMulti
        isSearchable
        placeholder="Select payment methods..."
        options={methodOptions}
        value={methodOptions.filter((opt) => selectedMethods.includes(opt.value))}
        onChange={(vals: MultiValue<{ label: string; value: string }>) =>
          setSelectedMethods(vals.map((v) => v.value))
        }
        formatOptionLabel={(option) => (
          <div className="flex items-center gap-2">
            <PGIcon type={option.value} />
            <span className="text-sm">{option.label}</span>
          </div>
        )}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#fff",
            borderColor: "#d1d5db",
            borderRadius: "0.5rem",
            padding: "0.25rem",
            fontSize: "14px",
            minHeight: "42px",
          }),
          menu: (base) => ({
            ...base,
            width: "auto",
            minWidth: "250px",
            maxWidth: "100%",
            zIndex: 10,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#6b21a8"
              : state.isFocused
              ? "#f3e8ff"
              : "white",
            color: "#111827", // ✅ force black font
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }),
          multiValueLabel: (base) => ({
            ...base,
            paddingLeft: "4px",
            paddingRight: "4px",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#f3e8ff",
            color: "#333",
          }),
        }}
        
      />
    </div>
  );
}
