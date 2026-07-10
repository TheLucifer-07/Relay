import { getInitials } from "../../utils/initials";

export default function Avatar({ item, size = "h-11 w-11", className = "" }) {
  if (!item) {
    return (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-2xl border border-white/10 text-sm font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] bg-white/10 text-white/40 ${className}`}
      >
        RU
      </div>
    );
  }

  const name = item.name || item.displayName || item.owner || "Relay User";
  const initials = item.avatarInitials || item.initials || getInitials(name);
  const color = item.avatarColor || item.color || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]";
  const avatarUrl = item.avatarUrl || item.avatar || item.photoURL;

  if (avatarUrl) {
    return (
      <div
        className={`relative flex ${size} shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] ${className}`}
      >
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-2xl border border-white/10 text-sm font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] ${color} ${className}`}
    >
      {initials}
    </div>
  );
}
