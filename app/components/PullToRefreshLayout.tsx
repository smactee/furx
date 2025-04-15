"use client";

import { useEffect, useRef, useState } from "react";

export default function PullToRefreshLayout({
  children,
  onRefresh = async () => {
    await new Promise((res) => setTimeout(res, 500));
  },
}: {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pulling, setPulling] = useState(false);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let startY = 0;
    let currentY = 0;
    let triggered = false;

    const onTouchStart = (e: TouchEvent) => {
      if (wrapper.scrollTop === 0) {
        startY = e.touches[0].clientY;
        triggered = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      if (distance > 0 && wrapper.scrollTop === 0) {
        e.preventDefault();
        setYOffset(distance > 80 ? 80 : distance);
        setPulling(true);
      }
    };

    const onTouchEnd = async () => {
      if (yOffset >= 60 && !triggered) {
        triggered = true;
        await onRefresh();
      }
      setYOffset(0);
      setPulling(false);
    };

    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);

    return () => {
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
    };
  }, [yOffset, onRefresh]);

  return (
    <div ref={wrapperRef} className="min-h-screen overflow-y-auto">
      {/* Pulling spinner */}
      <div
        className="flex items-center justify-center transition-all duration-300"
        style={{ height: pulling ? `${yOffset}px` : "0px" }}
      >
        {pulling && (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}
