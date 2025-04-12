"use client";

type PGSelectorProps = {
  label: string;
  selectedMethods: string[];
  setSelectedMethods: React.Dispatch<React.SetStateAction<string[]>>;
};

const allMethods = [
"Apple Pay",
"Alipay",
"Bitcoin",
"Cash App",
"Ethereum",
"Google Pay",
"Paypal",
"Razor Pay",
"Revolut",
"Samsung Pay",
"Stripe",
"Skrill",
"USDT Tether",
"Venmo",
"Wechat Pay",
"Wire Transfer",
"Wise",
"Zelle",
];

export default function PGSelector({
  label,
  selectedMethods,
  setSelectedMethods,
}: PGSelectorProps) {
  return (
    <div>
      <label className="block mb-1 mt-4">{label}</label>
      <div className="flex flex-wrap gap-2">
        {allMethods.map((method) => {
          const isSelected = selectedMethods.includes(method);
          const iconFile = `/icons/${method.toLowerCase().replace(/\s+/g, '')}.svg`;

          return (
            <button
              key={method}
              type="button"
              onClick={() => {
                setSelectedMethods((prev: string[]) =>
                  prev.includes(method)
                    ? prev.filter((m) => m !== method)
                    : [...prev, method]
                );
              }}
              className={`px-3 py-2 rounded-lg border text-sm flex flex-col items-center ${
                isSelected
                  ? "bg-purple-600 text-white border-purple-700"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <img
                src={iconFile}
                alt={method}
                className="w-6 h-6 mb-1"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const label = e.currentTarget.nextElementSibling as HTMLElement;
                  if (label) label.style.display = "inline";
                }}
              />
              <span className="text-xs">{method}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
