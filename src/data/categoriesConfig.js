import {
  BookOpen,
  Tag,
  Gift,
  Wrench,
  Laptop,
  Sofa,
  GraduationCap,
  Gem,
  RefreshCw,
  MoreHorizontal
} from "lucide-react";

export const CATEGORIES = [
  "All",
  "Books",
  "Coupons",
  "Gift Cards",
  "Tools",
  "Electronics",
  "Furniture",
  "Educational Kits",
  "Collectibles",
  "Reusable Resources",
  "Stationery",
  "Home Appliances",
  "Sports",
  "Musical Instruments",
  "Vehicles",
  "Accessories",
  "More"
];

export const SORTS = ["Newest", "Nearby", "Popular", "Verified Only"];

export const ICON_MAP = {
  "Books": { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)", blob: "bg-[#8dcde4]/18" },
  "Coupons": { icon: Tag, iconClass: "text-[#ff9f71]", glow: "rgba(255,159,113,0.13)", blob: "bg-[#ff9f71]/16" },
  "Gift Cards": { icon: Gift, iconClass: "text-[#ffc75b]", glow: "rgba(255,199,91,0.13)", blob: "bg-[#ffc75b]/16" },
  "Tools": { icon: Wrench, iconClass: "text-[#88c4ff]", glow: "rgba(136,196,255,0.13)", blob: "bg-[#88c4ff]/16" },
  "Electronics": { icon: Laptop, iconClass: "text-[#bb93ff]", glow: "rgba(187,147,255,0.12)", blob: "bg-[#bb93ff]/14" },
  "Furniture": { icon: Sofa, iconClass: "text-[#ffc75b]", glow: "rgba(255,199,91,0.13)", blob: "bg-[#ffc75b]/16" },
  "Educational Kits": { icon: GraduationCap, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)", blob: "bg-[#8dcde4]/18" },
  "Collectibles": { icon: Gem, iconClass: "text-[#ff9f71]", glow: "rgba(255,159,113,0.13)", blob: "bg-[#ff9f71]/16" },
  "Reusable Resources": { icon: RefreshCw, iconClass: "text-[#88c4ff]", glow: "rgba(136,196,255,0.13)", blob: "bg-[#88c4ff]/16" },
  "Stationery": { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)", blob: "bg-[#8dcde4]/18" },
  "Home Appliances": { icon: Laptop, iconClass: "text-[#ffc75b]", glow: "rgba(255,199,91,0.13)", blob: "bg-[#ffc75b]/16" },
  "Sports": { icon: Gem, iconClass: "text-[#bb93ff]", glow: "rgba(187,147,255,0.12)", blob: "bg-[#bb93ff]/14" },
  "Musical Instruments": { icon: Wrench, iconClass: "text-[#88c4ff]", glow: "rgba(136,196,255,0.13)", blob: "bg-[#88c4ff]/16" },
  "Vehicles": { icon: Tag, iconClass: "text-[#ff9f71]", glow: "rgba(255,159,113,0.13)", blob: "bg-[#ff9f71]/16" },
  "Accessories": { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)", blob: "bg-[#8dcde4]/18" },
  "More": { icon: MoreHorizontal, iconClass: "text-slate-400", glow: "rgba(187,147,255,0.12)", blob: "bg-[#bb93ff]/14" }
};

export default CATEGORIES;
