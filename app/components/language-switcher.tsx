"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function LanguageSwitcher({
  currentLocale,
  dict,
}: {
  currentLocale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = LOCALE_NAMES[currentLocale];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={dict.picker.label}
        className="caption px-3 py-1.5 border border-[color:var(--color-rule)] hover:bg-[color:var(--color-rule)]/20 transition-colors flex items-center gap-2"
      >
        <span aria-hidden>{current.flag}</span>
        <span className="uppercase tracking-wider">{currentLocale}</span>
        <span aria-hidden className="opacity-60 text-[10px]">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={dict.picker.label}
          className="absolute right-0 top-full mt-2 w-[260px] max-h-[420px] overflow-y-auto bg-[color:var(--color-bg)] border border-[color:var(--color-rule)] shadow-lg z-50"
        >
          <div className="px-4 py-3 caption border-b border-[color:var(--color-rule)] flex items-center justify-between">
            <span>{dict.picker.label}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.picker.close}
              className="opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
          <ul className="py-1">
            {LOCALES.map((loc) => {
              const meta = LOCALE_NAMES[loc];
              const active = loc === currentLocale;
              return (
                <li key={loc}>
                  <a
                    href={`/${loc}`}
                    role="option"
                    aria-selected={active}
                    className={`flex items-center gap-3 px-4 py-2.5 text-[15px] hover:bg-[color:var(--color-rule)]/30 transition-colors ${
                      active ? "font-bold" : ""
                    }`}
                    hrefLang={loc}
                  >
                    <span aria-hidden className="text-[18px]">{meta.flag}</span>
                    <span className="flex-1">{meta.native}</span>
                    <span className="text-[12px] opacity-60 uppercase tracking-wider">
                      {loc}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
