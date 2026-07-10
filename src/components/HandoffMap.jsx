import { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import GlassCard from "./ui/GlassCard";

const DARK_MAP_STYLE = {
  version: 8,
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  },
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export default function HandoffMap({ locationName, timeText, otherTraderName }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ me: null, them: null, spot: null });

  const [distance, setDistance] = useState(1.2);
  const [tracking, setTracking] = useState(true);
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState({
    me: { lat: 17.7062, lng: 83.3228 },
    them: { lat: 17.6998, lng: 83.3128 },
    spot: { lat: 17.7031, lng: 83.3185 } // Visakhapatnam — RK Beach default center
  });

  // Fetch geolocation coordinates
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const myLat = pos.coords.latitude;
        const myLng = pos.coords.longitude;
        setCoords({
          me: { lat: myLat + 0.003, lng: myLng + 0.003 },
          them: { lat: myLat - 0.003, lng: myLng - 0.003 },
          spot: { lat: myLat, lng: myLng }
        });
      },
      (err) => {
        console.warn("Geolocation fallback default center applied for HandoffMap:", err);
      },
      { timeout: 8000 }
    );
  }, []);

  // Converge simulation effect
  useEffect(() => {
    if (!tracking) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDistance(0.0);
          setTracking(false);
          clearInterval(interval);
          return 100;
        }
        const nextProgress = prev + 5;
        setDistance(Number((1.2 * (1 - nextProgress / 100)).toFixed(2)));
        return nextProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tracking]);

  // Load MapLibre GL map instance
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_MAP_STYLE,
      center: [coords.spot.lng, coords.spot.lat],
      zoom: 14.5,
      attributionControl: false,
      interactive: false // Lock user pan/zoom interactions during tracking convergence
    });

    mapInstanceRef.current = map;

    // Spot Marker
    const spotEl = document.createElement("div");
    spotEl.className = "flex h-9 w-9 items-center justify-center rounded-2xl border border-[#8dcde4] bg-[#071326] text-sm shadow-[0_4px_10px_rgba(0,0,0,0.3)]";
    spotEl.innerText = "📍";
    spotEl.title = locationName || "Handoff Spot";
    
    const spotMarker = new maplibregl.Marker({ element: spotEl })
      .setLngLat([coords.spot.lng, coords.spot.lat])
      .addTo(map);

    // Me Marker
    const meEl = document.createElement("div");
    meEl.className = "relative flex h-6 w-6 items-center justify-center";
    meEl.title = "Me";
    meEl.innerHTML = `
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8dcde4] opacity-50"></span>
      <span class="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#009bde] shadow-md"></span>
    `;

    const meMarker = new maplibregl.Marker({ element: meEl })
      .setLngLat([coords.me.lng, coords.me.lat])
      .addTo(map);

    // Them Marker
    const themEl = document.createElement("div");
    themEl.className = "relative flex h-6 w-6 items-center justify-center";
    themEl.title = otherTraderName || "Trader";
    themEl.innerHTML = `
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffc75b] opacity-50"></span>
      <span class="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ff9f71] shadow-md"></span>
    `;

    const themMarker = new maplibregl.Marker({ element: themEl })
      .setLngLat([coords.them.lng, coords.them.lat])
      .addTo(map);

    markersRef.current = { me: meMarker, them: themMarker, spot: spotMarker };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coords, locationName, otherTraderName]);

  // Update marker positions smoothly as progress ticks
  useEffect(() => {
    const { me, them } = markersRef.current;
    if (!me || !them) return;

    const ratio = progress / 100;

    // Interpolate coordinates
    const curMeLat = coords.me.lat + (coords.spot.lat - coords.me.lat) * ratio;
    const curMeLng = coords.me.lng + (coords.spot.lng - coords.me.lng) * ratio;
    const curThemLat = coords.them.lat + (coords.spot.lat - coords.them.lat) * ratio;
    const curThemLng = coords.them.lng + (coords.spot.lng - coords.them.lng) * ratio;

    me.setLngLat([curMeLng, curMeLat]);
    them.setLngLat([curThemLng, curThemLat]);

    // Recenter map center point
    if (mapInstanceRef.current) {
      mapInstanceRef.current.easeTo({
        center: [
          (curMeLng + curThemLng) / 2,
          (curMeLat + curThemLat) / 2
        ],
        duration: 300
      });
    }
  }, [progress, coords]);

  return (
    <GlassCard className="mt-4 overflow-hidden border border-white/[0.08] bg-white/[0.02] shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      {/* Map visualization canvas */}
      <div className="relative h-48 w-full bg-[#050912] overflow-hidden">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        
        {/* Spot HUD indicator */}
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 flex flex-col items-center z-10">
          <span className="rounded-md bg-black/80 px-2 py-0.5 text-[0.62rem] font-semibold text-white/80 border border-white/10 shadow-md backdrop-blur-sm">
            {locationName || "Handoff Spot"}
          </span>
        </div>
      </div>

      {/* Control Info bar */}
      <div className="bg-white/[0.015] border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#8dcde4] animate-pulse" />
            <span className="text-[0.74rem] font-semibold text-white/88">
              Live Handoff Tracker
            </span>
          </div>
          <p className="text-[0.68rem] text-white/46 mt-0.5">
            Distance: {distance > 0 ? `${distance} km remaining` : "Arrived at meeting point!"} · Time: {timeText || "Today"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (progress >= 100) setProgress(0);
            setTracking(!tracking);
          }}
          className="rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-3 py-1.5 text-[0.7rem] font-semibold text-white/82 transition-colors flex items-center gap-1.5"
        >
          {progress >= 100 ? "Re-track" : tracking ? "Pause GPS" : "Resume GPS"}
        </button>
      </div>
    </GlassCard>
  );
}
