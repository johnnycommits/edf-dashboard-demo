"use client";
import { useRef, useState, useEffect } from "react";
import { Bell } from "lucide-react";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [showing, setShowing] = useState(false);
  const [notifications, setNotifications] = useState(
    [
      { id: 1, text: "Usage spike at Chicago store", read: false },
      { id: 2, text: "Monthly report ready", read: false },
      { id: 3, text: "New alert threshold reached", read: false },
    ] as { id: number; text: string; read: boolean }[]
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Absolute positioning under trigger; no viewport listeners needed

  function openPanel() {
    setOpen(true);
    requestAnimationFrame(() => setShowing(true));
  }

  function closePanel() {
    setShowing(false);
    setOpen(false);
  }

  const unreadCount = notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);
  const displayCount = unreadCount > 9 ? "9+" : String(unreadCount);

  function markAsRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div ref={ref}>
      <button
        onClick={() => (open ? closePanel() : openPanel())}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors ${
          open
            ? "after:content-[''] after:absolute after:-bottom-[13px] after:right-[10px] after:w-0 after:h-0 after:border-x-[8px] after:border-x-transparent after:border-b-[8px] after:border-b-white after:z-[60] after:pointer-events-none"
            : ""
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-semibold border-2 border-edf-navy leading-none"
          >
            {displayCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute top-full right-[10px] w-[calc(100%-20px)] md:w-[min(20rem,calc(100vw-1rem))] z-50 py-3 bg-white rounded-xl shadow-xl border border-gray-100 transition-opacity duration-150 ease-out ${
            showing ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Triangle notch via container ::after only */}
          <div className="px-4 pb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-edf-mid-gray font-sans">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                className="text-xs font-medium text-edf-navy hover:underline"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[min(70vh,28rem)] overflow-auto">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-edf-light-gray cursor-pointer"
              >
                {!n.read && (
                  <span className="mt-1 w-2 h-2 rounded-full bg-edf-navy shrink-0" />
                )}
                <p className="text-sm text-edf-dark font-sans">{n.text}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
