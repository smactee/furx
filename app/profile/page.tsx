// PATCHED PROFILE PAGE WITH SHARED CODE FLAG DROPDOWN (FULL VERSION)

"use client";

import { useState, useEffect, useRef } from "react";
import { currencies } from "../components/currencies";
import { getAllCountries } from "../components/countries";
import { getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";
import metadata from "libphonenumber-js/metadata.full.json";
import { useClickOutside } from "../hooks/useClickOutside";
import { useEscapeKey } from "../hooks/useEscapeKey";



const countries = getAllCountries();


const sharedCountryCodes: Record<string, { code: string; name: string; flag: string }[]> = {
  "1": [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "TT", name: "Trinidad & Tobago", flag: "🇹🇹" },
  ],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    flagOverride: "",
    countryOfOrigin: "",
    currentCountry: "",
    city: "",
    baseCurrency: "USD",
    quoteCurrency: "USD",
  });

  const [cityDetected, setCityDetected] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userProfile") || "{}");

    if (!saved.currentCountry || !saved.city) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const detectedCountry = data.address?.country || "";
        const detectedCity =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.hamlet ||
          "";

        setProfile((prev) => ({
          ...prev,
          currentCountry: detectedCountry || prev.currentCountry,
          city: detectedCity || prev.city,
        }));

        if (detectedCity && !saved.city) {
          setCityDetected(true);
        }
      });
    }

    setProfile({
      name: saved.name || "",
      email: saved.email || "",
      phoneCode: saved.phoneCode || "+1",
phoneNumber: saved.phoneNumber || "",

      flagOverride: saved.flagOverride || "",
      countryOfOrigin: saved.countryOfOrigin || "",
      currentCountry: saved.currentCountry || "",
      city: saved.city || "",
      baseCurrency: saved.baseCurrency || "USD",
      quoteCurrency: saved.quoteCurrency || "USD",
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      phone: `${profile.phoneCode} ${profile.phoneNumber}`.trim(), // full readable version
    };
    
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    
    
    
    if (!isValidEmail(profile.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!profile.name) {
      alert("Please enter your name.");
      return;
    }
    
    alert("Profile saved!");
  };

  const numericCode = profile.phoneCode.replace("+", "");
  const countryOptions = sharedCountryCodes[numericCode];

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  

  function getFlagEmoji(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, (char: string) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  return (
<main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 p-6 pb-32 text-white">
<h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
        <div>
  <label className="block mb-2">Badges</label>
  <div className="flex flex-wrap gap-2 bg-white/10 p-4 rounded min-h-[144px] items-center">
    {["🏆", "💰", "🕒", "🌍", "🔥"].map((badge, idx) => (
      <div
        key={idx}
        className="w-10 h-10 flex items-center justify-center text-lg rounded-full bg-white/20"
      >
        {badge}
      </div>
    ))}
  </div>
</div>

          <ProfilePicturePicker compact />
          <div className="flex-1">
            <label className="block mb-1">Display Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/20 rounded p-2 text-white"
            />
          </div>
        </div>

        <Field
  label="Email Address"
  value={profile.email}
  onChange={(val) => handleChange("email", val)}
  placeholder="example@email.com"
/>


        <div>
          <label className="block mb-1">Phone</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded text-white">
              {countryOptions ? (
                <select
                  value={profile.flagOverride || countryOptions[0].code}
                  onChange={(e) => handleChange("flagOverride", e.target.value)}
                  className="bg-transparent text-white"
                >
                  {countryOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{getFlagEmoji(getRegionFromPhoneCode(profile.phoneCode))}</span>
              )}
<span className="text-white">+</span>
<input
  type="text"
  inputMode="numeric"
  value={profile.phoneCode.replace("+", "")}
  onChange={(e) => {
    const input = e.target.value.replace(/[^\d]/g, "");
    const codeOnly = input.match(/^\d{1,4}/)?.[0] || "";
    handleChange("phoneCode", "+" + codeOnly);
  }}
  className="bg-transparent w-16 outline-none text-white"
/>






            </div>

            <input
              type="tel"
              value={profile.phoneNumber || ""}
              onChange={(e) => {
                handleChange("phoneNumber", e.target.value.replace(/\D/g, ""));
              }}
              placeholder="712 345 678"
              className="flex-1 bg-white/20 rounded p-2 text-white"
            />
          </div>
        </div>

        <Dropdown
          label="Country of Origin"
          value={profile.countryOfOrigin}
          onChange={(val) => handleChange("countryOfOrigin", val)}
        />

        <Dropdown
          label="Currently Residing Country"
          value={profile.currentCountry}
          onChange={(val) => handleChange("currentCountry", val)}
        />

        <CityInput
          city={profile.city}
          onChange={(val) => {
            setCityDetected(false);
            handleChange("city", val);
          }}
          detected={cityDetected}
        />

        <div>
          <label className="block mb-1">Base Currency(I have)</label>
          <select
            value={profile.baseCurrency}
            onChange={(e) => handleChange("baseCurrency", e.target.value)}
            className="w-full bg-white/20 rounded p-2 text-white"
          >
            {currencies.map((c) => (
              <option key={c.value} value={c.value}>
                {`${c.symbol || ""} ${c.value} ${c.flag || ""}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Quote Currency(I want)</label>
          <select
            value={profile.quoteCurrency}
            onChange={(e) => handleChange("quoteCurrency", e.target.value)}
            className="w-full bg-white/20 rounded p-2 text-white"
          >
            {currencies.map((c) => (
              <option key={c.value} value={c.value}>
                {`${c.symbol || ""} ${c.value} ${c.flag || ""}`}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 rounded p-3 mt-4 text-white font-semibold"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  placeholder?: string; // ✅ add this
}) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder} // ✅ use it here
        className={`w-full bg-white/20 rounded p-2 text-white ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}


function Dropdown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/20 rounded p-2 text-white"
      >
        <option value="">Select a country</option>
        {countries.map((c: { code: string; name: string; flag: string }) => (
          <option key={c.code} value={c.name}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function CityInput({
  city,
  onChange,
  detected,
}: {
  city: string;
  onChange: (val: string) => void;
  detected: boolean;
}) {
  return (
    <div>
      <label className="block mb-1 flex items-center gap-2">
        City
        {detected && (
          <span className="text-xs text-green-300 bg-white/10 px-2 py-0.5 rounded-full">
            📍 Auto-detected
          </span>
        )}
      </label>
      <input
        type="text"
        value={city}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your city"
        className="w-full bg-white/20 rounded p-2 text-white"
      />
    </div>
  );
}

function ProfilePicturePicker({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("profilePicture");
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (src: string) => {
    setSelected(src);
    localStorage.setItem("profilePicture", src);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelected(base64);
      localStorage.setItem("profilePicture", base64);
    };
    reader.readAsDataURL(file);
  };

  const avatarNames = [
    "Ant", "Bear", "Bison", "Cat 1", "Cat 2", "Cat 3", "Cat 4", "Cat 5", "Chicken", "Chococat",
    "Cow", "Crocodile", "Dog 1", "Dog 2", "Dog 3", "Dog 4", "Dog 5", "Doraemon", "Duck", "Eagle",
    "Elephant", "Fox", "Giraffe", "Gorilla", "Hedgehog", "Hello Kitty", "Hippo", "Horse", "Keroppi",
    "Koala", "Leopard", "Lion", "Monkey", "Moose", "Mouse", "Otter", "Owl", "Panda", "Penguin",
    "Pig", "Pikachu", "Racoon", "Sheep", "Sloth", "Snake", "Squirrel", "Tiger", "Wolf", "Zebra"
  ];

  const avatarList = avatarNames.map((name) => `/avatars/${name}.svg`);

  const pickerRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(pickerRef, () => setShowPicker(false), showPicker);
  useEscapeKey(() => setShowPicker(false), showPicker);

  

  return (
    <div className={compact ? "" : "mb-6"}>
      <div className="relative inline-block" ref={pickerRef}>
  <img
    src={selected || "/avatars/Ant.svg"}
    alt="Selected Avatar"
    className={`rounded-full object-cover border border-white/30 ${
      compact ? "w-16 h-16" : "w-20 h-20"
    } cursor-pointer`}
    onClick={() => setShowPicker(!showPicker)}
  />

{showPicker && (
  <div className="absolute z-20 top-full left-0 mt-2 bg-purple-800 p-3 rounded-lg shadow-lg max-h-[300px] overflow-y-auto w-auto min-w-[360px] max-w-[90vw]">
    <button
      onClick={() => setShowPicker(false)}
      className="absolute top-2 right-2 text-white text-sm hover:text-red-300"
    >
      ×
    </button>

    <div className="grid grid-cols-5 gap-3 mt-6">
      {avatarList.map((src) => (
        <img
          key={src}
          src={src}
          alt="avatar"
          onClick={() => {
            handleSelect(src);
            setShowPicker(false);
          }}
          className={`w-14 h-14 rounded-full object-cover border-2 cursor-pointer ${
            selected === src ? "border-white" : "border-transparent"
          }`}
        />
      ))}
      {/* Upload Image Button Styled Like an Avatar */}
<label className="w-14 h-14 flex items-center justify-center rounded-full border-2 cursor-pointer bg-white/10 text-white text-xs text-center hover:bg-white/20">
  +
  <input
    type="file"
    accept="image/*"
    onChange={handleUpload}
    className="hidden"
  />
</label>

    </div>
  </div>
)}
    </div>
      {!compact && (
        <label className="text-sm underline cursor-pointer block mt-2">
          Upload Custom
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      )}
    </div>
  );
}


function getRegionFromPhoneCode(phoneCode: string): string {
  const numeric = phoneCode.replace("+", "");
  const matches = (metadata.country_calling_codes as any)[numeric] || [];
  return matches[0] || "UN";
}

function getFlagEmojiFromCode(phoneCode: string): string {
  try {
    const region = getRegionFromPhoneCode(phoneCode);
    return region
      .toUpperCase()
      .replace(/./g, (char: string) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  } catch {
    return "🏳️"; // fallback
  }
}