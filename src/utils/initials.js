export function getInitials(name) {
  if (!name || typeof name !== "string") return "RU";
  const cleaned = name.trim();
  if (!cleaned) return "RU";
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
