"use client";

import { useEffect, useRef } from "react";

interface MapPin {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  school_type: string;
}

interface Props {
  pins: MapPin[];
  height?: number;
}

const TYPE_COLORS: Record<string, string> = {
  special:    "#7c3aed",
  integrated: "#2563eb",
  inclusive:  "#059669",
};

export default function SchoolMapOverview({ pins, height = 420 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current || !mapRef.current || pins.length === 0) return;
    initialised.current = true;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(mapRef.current!, {
        zoom: 6,
        center: [-0.023559, 37.906193], // Kenya centre
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);

      pins.forEach((pin) => {
        const color = TYPE_COLORS[pin.school_type] ?? "#ff7a10";

        // Coloured circle marker
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:12px;height:12px;
            background:${color};
            border:2px solid white;
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        L.marker([pin.lat, pin.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:13px;">
              <strong>${pin.name}</strong><br/>
              <span style="color:#666;text-transform:capitalize">${pin.school_type}</span><br/>
              <a href="/schools/${pin.slug}" style="color:#ff7a10">View profile →</a>
            </div>`
          );
      });

      // Fit map to markers if we have some
      if (pins.length > 0) {
        const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    });
  }, [pins]);

  if (pins.length === 0) return null;

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className="rounded-2xl overflow-hidden border border-stone-200">
        {/* Legend */}
        <div className="bg-white border-b border-stone-100 px-4 py-2.5 flex items-center gap-4">
          <span className="text-xs font-display font-semibold text-stone-400 uppercase tracking-wider">Map legend</span>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1.5 text-xs text-stone-600 capitalize">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm inline-block" style={{ background: color }} />
              {type}
            </span>
          ))}
        </div>
        <div ref={mapRef} style={{ height }} className="w-full z-0" />
      </div>
    </>
  );
}
