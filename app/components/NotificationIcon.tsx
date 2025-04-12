"use client"; 
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationIcon() {
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    setShowDot(true);
  }, []);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-white" />
      {showDot && (
        <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
      )}
    </div>
  );
}
