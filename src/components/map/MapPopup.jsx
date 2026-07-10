
export default function MapPopup({ resource, onRequest }) {
  const getDirectionsUrl = () => {
    // If coords are an array [lng, lat]
    if (resource.coordinates) {
      const [lng, lat] = resource.coordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    // If separate fields
    const lat = resource.latitude || resource.lat;
    const lng = resource.longitude || resource.lng;
    if (lat && lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    return "#";
  };

  const categoryEmoji = {
    Books: "📚",
    Food: "🍱",
    Coupons: "🎟",
    Tools: "🛠",
    Electronics: "💻",
    Clothes: "👕",
    "Gift Cards": "🎟"
  }[resource.category] || "📦";

  return (
    <div className="w-[220px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,24,37,0.95)_0%,rgba(6,12,20,0.92)_100%)] p-2.5 text-white shadow-2xl backdrop-blur-md">
      {/* Header Visual */}
      <div className="relative h-24 w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#8dcde4]/20 to-[#ffc75b]/20 flex items-center justify-center mb-2.5">
        {resource.image || resource.images?.[0] ? (
          <img
            src={resource.image || resource.images[0]}
            alt={resource.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[2.2rem] filter drop-shadow">{categoryEmoji}</span>
        )}
        <span className="absolute top-1.5 left-1.5 rounded-lg bg-black/50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white border border-white/5">
          {resource.category}
        </span>
      </div>

      {/* Info Body */}
      <div className="space-y-2">
        <div>
          <h3 className="font-sans text-[0.88rem] font-semibold leading-snug text-white line-clamp-1">
            {resource.title}
          </h3>
          <div className="flex items-center justify-between text-[0.72rem] text-white/54 mt-0.5">
            <span>{resource.distance || resource.distanceText || "Nearby"}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate max-w-[80px]">{resource.owner || "Anonymous"}</span>
            </span>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRequest?.(resource);
            }}
            className="rounded-lg bg-[#8dcde4] py-1.5 text-[0.7rem] font-bold text-[#081a22] hover:opacity-90 active:scale-95 transition-all text-center"
          >
            Request
          </button>
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg border border-white/10 bg-white/5 py-1.5 text-[0.7rem] font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all text-center block"
          >
            Navigate
          </a>
        </div>
      </div>
    </div>
  );
}
