
export type Currency = {
  label: string;
  value: string;
  symbol: string;
  denomination: number;
  flag?: string;
};

export const currencies: Currency[] = [
  // Fiat 
  { label: "$ USD – US Dollar", value: "USD", symbol: "$", denomination: 1, flag: "🇺🇸" },
  { label: "¥ CNY – Chinese Yuan", value: "CNY", symbol: "¥", denomination: 1, flag: "🇨🇳" },
  { label: "¥ JPY – Japanese Yen", value: "JPY", symbol: "¥", denomination: 1, flag: "🇯🇵"},
  { label: "€ EUR – Euro", value: "EUR", symbol: "€", denomination: 1, flag: "🇪🇺" },
  { label: "₹ INR – Indian Rupee", value: "INR", symbol: "₹", denomination: 1, flag: "🇮🇳"},
  { label: "£ GBP – British Pound", value: "GBP", symbol: "£", denomination: 1, flag: "🇬🇧"},
  { label: "$ CAD – Canadian Dollar", value: "CAD", symbol: "$", denomination: 1, flag: "🇨🇦"},
  { label: "₽ RUB – Russian Ruble", value: "RUB", symbol: "₽", denomination: 1, flag: "🇷🇺"},
  { label: "₩ KRW – South Korean Won", value: "KRW", symbol: "₩", denomination: 1, flag: "🇰🇷"},
  //{ label: "$ AUD – Australian Dollar", value: "AUD", symbol: "$", denomination: 1, flag: "🇦🇺"},
  //{ label: "$ MXN – Mexican Peso", value: "MXN", symbol: "$", denomination: 1, flag: "🇲🇽"},
  //{ label: "Rp IDR – Indonesian Rupiah", value: "IDR", symbol: "Rp", denomination: 1, flag: "🇮🇩"},
  //{ label: "﷼ SAR – Saudi Riyal", value: "SAR", symbol: "﷼", denomination: 1, flag: "🇸🇦"},
  //{ label: "₺ TRY – Turkish Lira", value: "TRY", symbol: "₺", denomination: 1, flag: "🇹🇷"},
  //{ label: "$ ARS – Argentine Peso", value: "ARS", symbol: "$", denomination: 1, flag: "🇦🇷"},
  //{ label: "R ZAR – South African Rand", value: "ZAR", symbol: "R", denomination: 1, flag: "🇿🇦"},
  { label: "HK$ HKD – Hong Kong Dollar", value: "HKD", symbol: "$", denomination: 1, flag: "🇭🇰"},
  { label: "NT$ TWD – Taiwan Dollar", value: "TWD", symbol: "$", denomination: 1, flag: "🇹🇼"},
  { label: "฿ THB – Thai Baht", value: "THB", symbol: "฿", denomination: 1, flag: "🇹🇭"},
  // Crypto
  { label: "₿ BTC – Bitcoin", value: "BTC", symbol: "₿", denomination: 1, flag: "₿"},
  { label: "Ξ ETH – Ethereum", value: "ETH", symbol: "Ξ", denomination: 1, flag: "Ξ"},
  { label: "₮ USDT – Tether", value: "USDT", symbol: "₮", denomination: 1, flag: "₮"},
  { label: "Ɖ DOGE – Dogecoin", value: "DOGE", symbol: "Ɖ", denomination: 1, flag: "Ɖ"},
];




