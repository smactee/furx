"use client";

import { MessageCircle, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

type ChatPreview = {
  user: string;
  lastMessage: string;
  timestamp: number;
};

export default function ChatHomePage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [dragX, setDragX] = useState<Record<string, number>>({});
  const [activeDragUser, setActiveDragUser] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeUser = searchParams.get("user");

  const startX = useRef(0);
  const wasDragging = useRef(false);

  useEffect(() => {
    const demoUsers = [
      { user: "Alice", messages: ["Hi!", "Want to trade?"] },
      { user: "Bob", messages: ["Do you have PayPal?"] },
      { user: "Charlie", messages: ["I got USD."] },
    ];

    demoUsers.forEach(({ user, messages }) => {
      const key = `chat-${user}`;
      if (!localStorage.getItem(key)) {
        const fakeMessages = messages.map((text, i) => ({
          from: i % 2 === 0 ? "them" : "me",
          text,
          timestamp: Date.now() - (messages.length - i) * 60000,
        }));
        localStorage.setItem(key, JSON.stringify(fakeMessages));
      }
    });
  }, []);

  useEffect(() => {
    const allChats: ChatPreview[] = [];

    for (let key in localStorage) {
      if (key.startsWith("chat-")) {
        const messages = JSON.parse(localStorage.getItem(key) || "[]");
        if (messages.length === 0) continue;

        const last = messages[messages.length - 1];
        const user = key.replace("chat-", "");
        allChats.push({
          user,
          lastMessage: last.text,
          timestamp: last.timestamp,
        });
      }
    }

    allChats.sort((a, b) => b.timestamp - a.timestamp);
    setChats(allChats);
  }, []);

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleDelete = (user: string) => {
    localStorage.removeItem(`chat-${user}`);
    setChats((prev) => prev.filter((c) => c.user !== user));
    setDragX((prev) => {
      const newState = { ...prev };
      delete newState[user];
      return newState;
    });
  };

  const handleDragStart = (user: string, x: number) => {
    setActiveDragUser(user);
    startX.current = x;
    wasDragging.current = false;
  };

  const handleDragMove = (user: string, x: number) => {
    if (activeDragUser !== user) return;
    const delta = x - startX.current;
    if (Math.abs(delta) > 5) wasDragging.current = true;
    const clamped = Math.max(Math.min(delta, 0), -100);
    setDragX((prev) => ({ ...prev, [user]: clamped }));
  };

  const handleDragEnd = (user: string) => {
    const delta = dragX[user] || 0;
    if (delta < -80) {
      setDragX((prev) => ({ ...prev, [user]: -300 }));
      setTimeout(() => handleDelete(user), 200);
      return;
    }

    const shouldKeepOpen = Math.abs(delta) > 60;
    setDragX((prev) => ({ ...prev, [user]: shouldKeepOpen ? -100 : 0 }));
    setActiveDragUser(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 p-6 text-white">
      {activeUser ? (
        <>
          <button
            onClick={() => router.push("/chats")}
            className="mb-4 text-sm text-purple-300 underline"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold mb-2">Chat with {activeUser}</h1>

          <div className="relative min-h-[70vh]">
            {/* Chat bubbles */}
            <div className="flex flex-col gap-2 pb-28 max-h-[60vh] overflow-y-auto px-1">
            {(JSON.parse(localStorage.getItem(`chat-${activeUser}`) || "[]") as {
                from: string;
                text: string;
              }[]).map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                    msg.from === "me"
                      ? "bg-purple-500 self-end text-white"
                      : "bg-white/20 self-start text-white"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Message input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.message as HTMLInputElement;
                const text = input.value.trim();
                if (!text) return;

                const key = `chat-${activeUser}`;
                const current = JSON.parse(localStorage.getItem(key) || "[]");
                const updated = [...current, { from: "me", text, timestamp: Date.now() }];
                localStorage.setItem(key, JSON.stringify(updated));
                input.value = "";
                router.refresh();
              }}
              className="fixed bottom-16 left-0 w-full bg-white/10 backdrop-blur-md px-4 py-3 flex items-center gap-3 z-50"            >
              <input
                name="message"
                placeholder="Type your message..."
                className="flex-1 bg-white/20 rounded-full px-4 py-2 text-sm text-white outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-full px-4 py-2 text-sm font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Chats
          </h1>

          {chats.length === 0 ? (
            <p className="text-white/60">No chats yet.</p>
          ) : (
            <ul className="space-y-4">
              {chats.map((chat) => {
                const translateX = dragX[chat.user] || 0;

                return (
                  <li
                    key={chat.user}
                    className="relative overflow-hidden"
                    onMouseDown={(e) => handleDragStart(chat.user, e.clientX)}
                    onMouseMove={(e) => {
                      if (activeDragUser === chat.user && e.buttons === 1) {
                        handleDragMove(chat.user, e.clientX);
                      }
                    }}
                    onMouseUp={() => handleDragEnd(chat.user)}
                    onTouchStart={(e) => handleDragStart(chat.user, e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(chat.user, e.touches[0].clientX)}
                    onTouchEnd={() => handleDragEnd(chat.user)}
                  >
                    {/* Delete button */}
                    <div
                      className={`absolute right-0 top-0 bottom-0 flex items-center pr-6 bg-red-600 z-0 transition-all duration-300 ${
                        (dragX[chat.user] || 0) === 0
                          ? "opacity-0 translate-x-6"
                          : "opacity-100 translate-x-0"
                      }`}
                    >
                      <button
                        onClick={() => handleDelete(chat.user)}
                        className="text-white p-2 rounded shadow"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Chat card */}
                    <motion.div
                      onClick={() => {
                        if (!wasDragging.current && translateX > -120) {
                          router.push(`/chats?user=${chat.user}`);
                        }
                      }}
                      className="relative z-10 bg-white/10 rounded-lg p-4 cursor-pointer active:opacity-80"
                      animate={{
                        x: translateX,
                        opacity: translateX <= -150 ? 0 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{chat.user}</p>
                        <span className="text-sm text-white/60">
                          {formatTime(chat.timestamp)}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mt-1 truncate">{chat.lastMessage}</p>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
