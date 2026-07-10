import { api } from "../lib/api";

let googleMapsPromise = null;

export function loadGoogleMaps() {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = (async () => {
    let apiKey = "";
    try {
      const res = await api.getGoogleMapsKey();
      apiKey = res?.apiKey || "";
    } catch (e) {
      console.warn("Could not load Google Maps API key from server, checking environment...", e);
      apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error("Google Maps script loaded, but namespace not resolved."));
        }
      };
      script.onerror = (err) => {
        reject(err);
      };
      document.head.appendChild(script);
    });
  })();

  return googleMapsPromise;
}
