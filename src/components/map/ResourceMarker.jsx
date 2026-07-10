
export default function ResourceMarker({ category }) {
  const getCategoryStyles = () => {
    switch (category) {
      case "Books":
        return "border-[#8dcde4] bg-[linear-gradient(135deg,rgba(141,205,228,0.22)_0%,rgba(141,205,228,0.12)_100%)] shadow-[0_4px_12px_rgba(141,205,228,0.22)]";
      case "Food":
        return "border-[#c4e0a8] bg-[linear-gradient(135deg,rgba(196,224,168,0.22)_0%,rgba(196,224,168,0.12)_100%)] shadow-[0_4px_12px_rgba(196,224,168,0.22)]";
      case "Coupons":
      case "Gift Cards":
        return "border-[#ffc75b] bg-[linear-gradient(135deg,rgba(255,199,91,0.22)_0%,rgba(255,199,91,0.12)_100%)] shadow-[0_4px_12px_rgba(255,199,91,0.22)]";
      case "Tools":
        return "border-[#bb93ff] bg-[linear-gradient(135deg,rgba(187,147,255,0.22)_0%,rgba(187,147,255,0.12)_100%)] shadow-[0_4px_12px_rgba(187,147,255,0.22)]";
      case "Electronics":
        return "border-[#88c4ff] bg-[linear-gradient(135deg,rgba(136,196,255,0.22)_0%,rgba(136,196,255,0.12)_100%)] shadow-[0_4px_12px_rgba(136,196,255,0.22)]";
      case "Clothes":
        return "border-[#ff9f71] bg-[linear-gradient(135deg,rgba(255,159,113,0.22)_0%,rgba(255,159,113,0.12)_100%)] shadow-[0_4px_12px_rgba(255,159,113,0.22)]";
      default:
        return "border-white/20 bg-white/5 shadow-md";
    }
  };

  const getCategoryEmoji = () => {
    switch (category) {
      case "Books": return "📚";
      case "Food": return "🍱";
      case "Coupons":
      case "Gift Cards":
        return "🎟";
      case "Tools": return "🛠";
      case "Electronics": return "💻";
      case "Clothes": return "👕";
      default: return "📦";
    }
  };

  return (
    <div className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-115 hover:-translate-y-0.5 cursor-pointer ${getCategoryStyles()}`}>
      <span className="text-[1.38rem] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.16)] select-none">
        {getCategoryEmoji()}
      </span>
      {/* Pin Tail indicator */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-inherit bg-inherit"></div>
    </div>
  );
}
