// ════════════════════════════════════════════════════════════════════
// Iconography — Parkway's official icon set is Phosphor.
// Single source for the icons the hub's own UI uses, plus the curated
// showcase on the Icons page.
//
// IMPORTANT: import each icon from its own subpath (@phosphor-icons/react/X),
// never from the barrel ("@phosphor-icons/react"). The barrel makes Vite
// pre-bundle the entire ~6MB library in dev (which breaks the dev server);
// per-icon subpaths keep only the handful we actually use.
// ════════════════════════════════════════════════════════════════════

// — chrome / UI —
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { X } from "@phosphor-icons/react/X";
import { CaretRight } from "@phosphor-icons/react/CaretRight";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { Copy } from "@phosphor-icons/react/Copy";
import { Check } from "@phosphor-icons/react/Check";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";

// — rail (module) icons —
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { SquaresFour } from "@phosphor-icons/react/SquaresFour";
import { Swatches } from "@phosphor-icons/react/Swatches";
import { FolderOpen } from "@phosphor-icons/react/FolderOpen";

// — finance-relevant showcase —
import { Wallet } from "@phosphor-icons/react/Wallet";
import { CreditCard } from "@phosphor-icons/react/CreditCard";
import { Bank } from "@phosphor-icons/react/Bank";
import { Coins } from "@phosphor-icons/react/Coins";
import { Money } from "@phosphor-icons/react/Money";
import { CurrencyNgn } from "@phosphor-icons/react/CurrencyNgn";
import { CurrencyDollar } from "@phosphor-icons/react/CurrencyDollar";
import { Receipt } from "@phosphor-icons/react/Receipt";
import { ArrowsLeftRight } from "@phosphor-icons/react/ArrowsLeftRight";
import { PaperPlaneTilt } from "@phosphor-icons/react/PaperPlaneTilt";
import { HandCoins } from "@phosphor-icons/react/HandCoins";
import { ChartLineUp } from "@phosphor-icons/react/ChartLineUp";
import { ShieldCheck } from "@phosphor-icons/react/ShieldCheck";

// — common basic-UI showcase (extras beyond the chrome set above) —
import { Plus } from "@phosphor-icons/react/Plus";
import { Gear } from "@phosphor-icons/react/Gear";
import { Envelope } from "@phosphor-icons/react/Envelope";
import { Bell } from "@phosphor-icons/react/Bell";
import { User } from "@phosphor-icons/react/User";
import { Eye } from "@phosphor-icons/react/Eye";
import { EyeSlash } from "@phosphor-icons/react/EyeSlash";
import { Calendar } from "@phosphor-icons/react/Calendar";
import { Trash } from "@phosphor-icons/react/Trash";
import { PencilSimple } from "@phosphor-icons/react/PencilSimple";
import { Lock } from "@phosphor-icons/react/Lock";

export {
  MagnifyingGlass, X, CaretRight, CaretDown, ArrowRight, ArrowUpRight,
  Copy, Check, DownloadSimple,
};

// Rail module icon-key → component
export const RAIL_ICONS = { BookOpen, SquaresFour, Swatches, FolderOpen };

// Curated showcase for the Icons page (name shown is the Phosphor export).
// A deliberately small, finance-first slice — NOT the whole library.
export const CURATED = [
  // Finance
  ["Wallet", Wallet], ["CreditCard", CreditCard], ["Bank", Bank],
  ["Coins", Coins], ["Money", Money], ["CurrencyNgn", CurrencyNgn],
  ["CurrencyDollar", CurrencyDollar], ["Receipt", Receipt],
  ["ArrowsLeftRight", ArrowsLeftRight], ["PaperPlaneTilt", PaperPlaneTilt],
  ["HandCoins", HandCoins], ["ChartLineUp", ChartLineUp], ["ShieldCheck", ShieldCheck],
  // Basic UI
  ["MagnifyingGlass", MagnifyingGlass], ["CaretDown", CaretDown], ["CaretRight", CaretRight],
  ["X", X], ["Plus", Plus], ["Check", Check], ["ArrowRight", ArrowRight],
  ["ArrowUpRight", ArrowUpRight], ["Gear", Gear], ["Envelope", Envelope],
  ["Bell", Bell], ["User", User], ["Eye", Eye], ["EyeSlash", EyeSlash],
  ["Calendar", Calendar], ["Trash", Trash], ["PencilSimple", PencilSimple],
  ["Lock", Lock], ["Copy", Copy], ["DownloadSimple", DownloadSimple],
];
