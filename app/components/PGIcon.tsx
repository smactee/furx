"use client";

import { useState } from "react";

export default function PGIcon({ type }: { type: string }) {
  const [iconError, setIconError] = useState(false);
  const iconFile = `/icons/${type.toLowerCase().replace(/\s+/g, '')}.svg`;

  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg p-2">
      {!iconError ? (
        <img
          src={iconFile}
          alt={type}
          className="w-12 h-12 object-contain"
          onError={() => setIconError(true)}
        />
      ) : (
        <span className="text-[10px] text-white font-medium">{type}</span>
      )}
    </div>
  );
  
}
