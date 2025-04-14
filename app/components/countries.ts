import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export const getAllCountries = () => {
  const countryObj = countries.getNames("en", { select: "official" });

  return Object.entries(countryObj)
    .map(([code, name]) => ({
      code,
      name,
      flag: getFlagEmoji(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
