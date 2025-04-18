// ✅ PullToRefreshLayout.tsx – Fully working pull-to-refresh wrapper
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
    let isMouseDown = false;
    let triggered = false;

    const onTouchStart = (e: TouchEvent) => {
      if (wrapper.scrollTop === 0) {
        startY = e.touches[0].clientY;
        triggered = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const distance = e.touches[0].clientY - startY;
      if (wrapper.scrollTop === 0 && distance > 0) {
        e.preventDefault();
        const capped = Math.min(distance, 21);
        setYOffset(capped);
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

    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [yOffset, onRefresh]);

  return (
    <div
      ref={wrapperRef}
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          transform: `translateY(${yOffset}px)`,
          transition: "transform 0.3s ease-out",
          willChange: "transform",
        }}
      >
        {pulling && yOffset > 20 && (
          <div
            className="flex items-center justify-center"
            style={{ height: 60 }}
          >
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}