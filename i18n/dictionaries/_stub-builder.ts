import type { Dictionary } from "../types";
import { en } from "./en";

/**
 * Build a stub dictionary for a locale we don't yet hand-translate.
 * Hero h1 + CTA + footer "made-in" are localized; the rest falls back to English.
 * The page renders an "auto-translated" notice on stub locales.
 */
export function makeStub(overrides: {
  h1: string;
  cta: string;
  ctaSecondary?: string;
  preorder: string;
  madeIn: string;
  picker: string;
  closeLabel: string;
  metaTitle: string;
  metaDescription: string;
  noticeAuto: string;
  langName: string;
}): Dictionary {
  return {
    ...en,
    meta: {
      ...en.meta,
      title: overrides.metaTitle,
      description: overrides.metaDescription,
    },
    hero: {
      ...en.hero,
      h1: overrides.h1,
      cta: overrides.cta,
    },
    ctaBuy: {
      ...en.ctaBuy,
      cta: overrides.cta,
    },
    footer: {
      ...en.footer,
      madeIn: overrides.madeIn,
    },
    picker: { label: overrides.picker, close: overrides.closeLabel },
    preorderTag: overrides.preorder,
    noticeAuto: overrides.noticeAuto,
    highQuality: false,
  };
}
