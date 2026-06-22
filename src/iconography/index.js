// ════════════════════════════════════════════════════════════════════
// Iconography — Parkway's official icon set is Phosphor.
// Single source for the icons used across the hub's own UI, plus the
// curated showcase rendered on the Icons foundation page.
// ════════════════════════════════════════════════════════════════════

import {
  // chrome / UI
  MagnifyingGlass, X, CaretRight, CaretDown, ArrowRight, ArrowUpRight,
  Copy, Check, DownloadSimple,
  // rail (module) icons
  BookOpen, SquaresFour, Swatches, FolderOpen,
} from "@phosphor-icons/react";

export {
  MagnifyingGlass, X, CaretRight, CaretDown, ArrowRight, ArrowUpRight,
  Copy, Check, DownloadSimple,
};

// Rail module icon-key → component
export const RAIL_ICONS = { BookOpen, SquaresFour, Swatches, FolderOpen };

// Curated showcase for the Icons page (name shown is the Phosphor export).
import {
  House, User, Gear, Bell, Heart, Star, ChatCircle, Envelope, Calendar,
  Clock, Trash, PencilSimple, Plus, Link, Lock, Eye, EyeSlash, Cloud,
  Sun, Moon, Image, File, Folder, Tag, Bookmark, Flag, Cube, Lightning,
  Fire, Camera, Phone, Globe, CreditCard, ShoppingCart, MapPin, Rocket,
} from "@phosphor-icons/react";

export const CURATED = [
  ["House", House], ["User", User], ["Gear", Gear], ["Bell", Bell],
  ["MagnifyingGlass", MagnifyingGlass], ["Heart", Heart], ["Star", Star],
  ["ChatCircle", ChatCircle], ["Envelope", Envelope], ["Calendar", Calendar],
  ["Clock", Clock], ["Trash", Trash], ["PencilSimple", PencilSimple],
  ["Plus", Plus], ["Check", Check], ["X", X], ["ArrowRight", ArrowRight],
  ["CaretRight", CaretRight], ["DownloadSimple", DownloadSimple], ["Link", Link],
  ["Lock", Lock], ["Eye", Eye], ["EyeSlash", EyeSlash], ["Cloud", Cloud],
  ["Sun", Sun], ["Moon", Moon], ["Image", Image], ["File", File],
  ["Folder", Folder], ["Tag", Tag], ["Bookmark", Bookmark], ["Flag", Flag],
  ["Cube", Cube], ["Lightning", Lightning], ["Fire", Fire], ["Camera", Camera],
  ["Phone", Phone], ["Globe", Globe], ["CreditCard", CreditCard],
  ["ShoppingCart", ShoppingCart], ["MapPin", MapPin], ["Rocket", Rocket],
];
