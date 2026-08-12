"use client";

import { useEffect, useState } from "react";

const KOLKATA_TIME = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function getParts(now: Date) {
  const parts: Record<string, string> = {};
  for (const p of KOLKATA_TIME.formatToParts(now)) {
    parts[p.type] = p.value;
  }
  return {
    hour: parts.hour ?? "",
    minute: parts.minute ?? "",
    second: parts.second ?? "",
    dayPeriod: parts.dayPeriod ?? "",
  };
}

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let iv: number | undefined;
    const timeout = window.setTimeout(() => {
      setNow(new Date());
      iv = window.setInterval(() => setNow(new Date()), 1000);
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, []);

  if (!now) return null;

  const { hour, minute, second, dayPeriod } = getParts(now);

  return (
    <div className="fixed left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-20 select-none font-mono text-cream">
      <div className="flex items-baseline leading-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
        <span className="text-[34px] font-bold tracking-tight tabular-nums">{hour}</span>
        <span className="animate-blink text-[34px] font-bold">:</span>
        <span className="text-[34px] font-bold tabular-nums">{minute}</span>
        <span className="ml-2 text-[12px] font-medium uppercase tracking-[0.24em] text-white/50">
          {dayPeriod}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/45">
        <span>IST</span>
        <span className="h-px w-6 bg-white/30" />
        <span className="tabular-nums">{second}</span>
      </div>
    </div>
  );
}