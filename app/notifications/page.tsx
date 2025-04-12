"use client";

import { useEffect, useState } from "react";
import { Bell, Trash } from "lucide-react";

type Notification = {
  id: number;
  message: string;
  timestamp: number;
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentlyDeleting, setCurrentlyDeleting] = useState<number | null>(null);

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

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    localStorage.setItem("notifications", JSON.stringify(notifications.filter((n) => n.id !== id)));
    updateBadge(notifications.length - 1);
  };

  const handleDeleteAll = () => {
    const queue = [...notifications.map((n) => n.id)];
    if (queue.length === 0) return;

    const animateAndDelete = (index: number) => {
      const currentId = queue[index];
      if (!currentId) return;

      setCurrentlyDeleting(currentId);

      const el = document.getElementById(`notif-${currentId}`);
      if (el) {
        const onTransitionEnd = () => {
          el.removeEventListener("transitionend", onTransitionEnd);
          setNotifications((prev) => prev.filter((n) => n.id !== currentId));
          localStorage.setItem("notifications", JSON.stringify(notifications.filter((n) => n.id !== currentId)));
          updateBadge(queue.length - 1 - index);
          animateAndDelete(index + 1);
        };

        el.addEventListener("transitionend", onTransitionEnd);

        // Force reflow so transition can apply
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
              <li
                key={n.id}
                id={`notif-${n.id}`}
                style={{
                  position: "relative",
                  transition: "margin-top 0.5s ease, transform 0.5s ease, opacity 0.5s ease",
                }}
                className="bg-white/10 p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-white/60 mt-1">{formatTime(n.timestamp)}</p>
                </div>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-white/60 hover:text-red-400"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleDeleteAll}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-semibold"
          >
            Delete All Notifications
          </button>
        </>
      )}
    </main>
  );
}
