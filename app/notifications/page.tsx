"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Trash } from "lucide-react";
import { motion } from "framer-motion";

const SWIPE_THRESHOLD = -80;

type Notification = {
  id: number;
  message: string;
  timestamp: number;
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentlyDeleting, setCurrentlyDeleting] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cancelRef = useRef(false);

  const updateBadge = (count: number) => {
    const badge = document.getElementById("noti-count");
    if (badge) badge.textContent = count > 0 ? count.toString() : "";
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(saved);
    updateBadge(saved.length);

    const interval = setInterval(() => {
      const newNoti = {
        id: Date.now(),
        message: `New exchange matched with user ${Math.floor(Math.random() * 100)}`,
        timestamp: Date.now(),
      };

      setNotifications((prev) => {
        const updated = [newNoti, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        updateBadge(updated.length);
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) {
      localStorage.setItem("notificationsSeen", "true");
    }
  }, [notifications]);

  const handleSingleDelete = (id: number) => {
    const el = document.getElementById(`notif-inner-${id}`);
    if (el) {
      el.style.transition = "margin-top 0.5s ease, transform 0.5s ease, opacity 0.5s ease";
      el.style.marginTop = "-64px";
      el.style.transform = "translateX(-100%)";
      el.style.opacity = "0";

      el.addEventListener("transitionend", () => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        localStorage.setItem("notifications", JSON.stringify(notifications.filter((n) => n.id !== id)));
        updateBadge(notifications.length - 1);
      }, { once: true });
    }
  };

  const handleDeleteAll = () => {
    if (isAnimating) {
      cancelRef.current = true;
      return;
    }

    const queue = [...notifications.map((n) => n.id)];
    if (queue.length === 0) return;

    setIsAnimating(true);
    cancelRef.current = false;

    const animateAndDelete = (index: number) => {
      if (cancelRef.current) {
        setIsAnimating(false);
        setCurrentlyDeleting(null);
        return;
      }

      const currentId = queue[index];
      if (!currentId) {
        setIsAnimating(false);
        return;
      }

      setCurrentlyDeleting(currentId);

      const el = document.getElementById(`notif-inner-${currentId}`);
      if (el) {
        const onTransitionEnd = () => {
          el.removeEventListener("transitionend", onTransitionEnd);
          setNotifications((prev) => prev.filter((n) => n.id !== currentId));
          localStorage.setItem("notifications", JSON.stringify(notifications.filter((n) => n.id !== currentId)));
          updateBadge(queue.length - 1 - index);
          animateAndDelete(index + 1);
        };

        el.addEventListener("transitionend", onTransitionEnd);
        void el.offsetWidth;

        el.style.transition = "margin-top 0.5s ease, transform 0.5s ease, opacity 0.5s ease";
        el.style.marginTop = "-64px";
        el.style.transform = "translateX(-100%)";
        el.style.opacity = "0";
      }
    };

    animateAndDelete(0);
  };

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell className="w-6 h-6" />
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-white/60">No notifications yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  id={`notif-${n.id}`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < SWIPE_THRESHOLD) {
                      handleSingleDelete(n.id);
                    }
                  }}
                >
                  <div
                    id={`notif-inner-${n.id}`}
                    className="bg-white/10 p-4 rounded-lg flex justify-between items-start"
                    style={{
                      position: "relative",
                      transition: "margin-top 0.5s ease, transform 0.5s ease, opacity 0.5s ease"
                    }}
                  >
                    <div>
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-white/60 mt-1">{formatTime(n.timestamp)}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.li>
            ))}
          </ul>

          <button
            onClick={handleDeleteAll}
            className={`text-white py-2 px-4 rounded-lg text-sm font-semibold transition ${
              isAnimating
                ? "bg-red-800 fixed bottom-16 left-6 right-6 z-50 w-[calc(100%-3rem)] mx-auto"
                : "bg-red-600 hover:bg-red-700 w-full mt-6"
            }`}
          >
            {isAnimating ? "Cancel" : "Delete All"}
          </button>
        </>
      )}
    </main>
  );
}