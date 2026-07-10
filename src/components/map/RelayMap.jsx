import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import UserMarker from "./UserMarker";
import ResourceMarker from "./ResourceMarker";
import MapPopup from "./MapPopup";

const DEFAULT_CENTER = [83.3185, 17.7031]; // Visakhapatnam — RK Beach area [lng, lat]

// Dark Map style utilizing Carto Dark Matter raster tiles
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
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

export default function RelayMap({ listings = [], onRequest, className = "" }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const activeMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);
  
  const [userLocation, setUserLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const initialCenter = userLocation || DEFAULT_CENTER;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_MAP_STYLE,
      center: initialCenter,
      zoom: 13,
      minZoom: 2,
      maxZoom: 18,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("zoomend", () => {
      setMapZoom(map.getZoom());
    });

    map.on("moveend", () => {
      // Re-trigger cluster calculation on pan/move
      setMapZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    // Fetch browser location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setTimeout(() => {
            setUserLocation([longitude, latitude]);
          }, 0);
          map.easeTo({ center: [longitude, latitude], zoom: 14, duration: 1500 });
        },
        (error) => {
          console.warn("Geolocation fallback default center applied:", error);
          setTimeout(() => {
            setUserLocation(DEFAULT_CENTER);
          }, 0);
        }
      );
    } else {
      setTimeout(() => {
        setUserLocation(DEFAULT_CENTER);
      }, 0);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update/draw User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const el = document.createElement("div");
    const root = createRoot(el);
    root.render(<UserMarker />);

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(userLocation)
      .addTo(map);

    userMarkerRef.current = marker;
  }, [userLocation]);

  // Recalculate clusters and render markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old active markers and their React roots
    activeMarkersRef.current.forEach((m) => {
      m.marker.remove();
      if (m.root) {
        setTimeout(() => m.root.unmount(), 0);
      }
    });
    activeMarkersRef.current = [];

    // Simple grid clustering algorithm based on Zoom level
    const clustered = clusterListings(listings, mapZoom);

    clustered.forEach((group) => {
      const el = document.createElement("div");
      const root = createRoot(el);

      if (group.isCluster) {
        // Render Cluster marker bubble
        root.render(
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8dcde4] bg-[rgba(14,24,37,0.85)] text-[#8dcde4] text-xs font-bold shadow-[0_4px_12px_rgba(141,205,228,0.22)] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 transition-all">
            {group.count}
          </div>
        );

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(group.center)
          .addTo(map);

        // Click cluster to zoom in
        el.addEventListener("click", () => {
          map.easeTo({
            center: group.center,
            zoom: Math.min(map.getZoom() + 2, 17),
            duration: 800
          });
        });

        activeMarkersRef.current.push({ marker, root });
      } else {
        // Render single ResourceMarker component
        const listing = group.listing;
        root.render(<ResourceMarker category={listing.category} />);

        const coords = listing.coordinates || [
          listing.longitude || listing.lng || DEFAULT_CENTER[0],
          listing.latitude || listing.lat || DEFAULT_CENTER[1]
        ];

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(map);

        // Attach popup card
        const popupEl = document.createElement("div");
        const popupRoot = createRoot(popupEl);
        popupRoot.render(<MapPopup resource={listing} onRequest={onRequest} />);

        const popup = new maplibregl.Popup({
          offset: 20,
          closeButton: false,
          className: "relay-dark-popup"
        }).setDOMContent(popupEl);

        marker.setPopup(popup);

        activeMarkersRef.current.push({ marker, root: { unmount: () => { root.unmount(); popupRoot.unmount(); } } });
      }
    });
  }, [listings, mapZoom, onRequest]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#050912] ${className}`}>
      {/* Map element canvas container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Global dark style customizations for default popups */}
      <style dangerouslySetInnerHTML={{ __html: `
        .maplibregl-popup-content {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-popup-anchor-top .maplibregl-popup-tip {
          border-bottom-color: rgba(14, 24, 37, 0.95) !important;
        }
        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-top-color: rgba(6, 12, 20, 0.92) !important;
        }
        .maplibregl-popup-anchor-left .maplibregl-popup-tip {
          border-right-color: rgba(14, 24, 37, 0.95) !important;
        }
        .maplibregl-popup-anchor-right .maplibregl-popup-tip {
          border-left-color: rgba(14, 24, 37, 0.95) !important;
        }
      ` }} />
    </div>
  );
}

// Grid Clustering Helper
function clusterListings(listings, zoom) {
  if (listings.length === 0) return [];
  if (zoom >= 14) {
    // Render individual pins when zoomed close
    return listings.map((l) => ({ isCluster: false, listing: l }));
  }

  // Cell size threshold dynamically scaling with zoom
  const cellSize = 0.05 / Math.pow(1.8, zoom - 10);
  const groups = {};

  listings.forEach((listing) => {
    const coords = listing.coordinates || [
      listing.longitude || listing.lng || DEFAULT_CENTER[0],
      listing.latitude || listing.lat || DEFAULT_CENTER[1]
    ];
    
    const cellX = Math.round(coords[0] / cellSize);
    const cellY = Math.round(coords[1] / cellSize);
    const key = `${cellX},${cellY}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push({ coords, listing });
  });

  return Object.values(groups).map((group) => {
    if (group.length === 1) {
      return { isCluster: false, listing: group[0].listing };
    }

    // Average coordinates
    let sumLng = 0;
    let sumLat = 0;
    group.forEach((item) => {
      sumLng += item.coords[0];
      sumLat += item.coords[1];
    });

    return {
      isCluster: true,
      count: group.length,
      center: [sumLng / group.length, sumLat / group.length]
    };
  });
}
