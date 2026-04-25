import type { Locale } from "../config";
import type { Dictionary } from "../types";
import { fr } from "./fr";
import { en } from "./en";
import { de } from "./de";
import { es } from "./es";
import { it } from "./it";
import { nl } from "./nl";
import { pl } from "./pl";
import { pt } from "./pt";
import { cs } from "./cs";
import { da } from "./da";
import { fi } from "./fi";
import { sv } from "./sv";
import { el } from "./el";
import { hu } from "./hu";
import { ro } from "./ro";
import { bg } from "./bg";
import { hr } from "./hr";
import { sk } from "./sk";
import { sl } from "./sl";
import { lv } from "./lv";
import { lt } from "./lt";
import { et } from "./et";
import { mt } from "./mt";
import { ga } from "./ga";

const ALL: Record<Locale, Dictionary> = {
  fr,
  en,
  de,
  es,
  it,
  nl,
  pl,
  pt,
  cs,
  da,
  fi,
  sv,
  el,
  hu,
  ro,
  bg,
  hr,
  sk,
  sl,
  lv,
  lt,
  et,
  mt,
  ga,
};

export function getDictionary(locale: Locale): Dictionary {
  return ALL[locale];
}
