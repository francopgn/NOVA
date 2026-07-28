"use client";
import * as React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Professional } from "@/lib/types";

const STATUS_HEX: Record<Professional["status"], string> = {
  disponible: "#34d399",
  ocupada: "#f59e0b",
  desconectado: "#6b7280",
};

function pinIcon(status: Professional["status"], active: boolean) {
  const color = STATUS_HEX[status];
  const scale = active ? 1.25 : 1;
  const pulse = status === "disponible"
    ? `<span style="position:absolute;inset:-6px;border-radius:9999px;background:${color}55;animation:pulseMap 2.2s ease-out infinite"></span>`
    : "";
  const html = `
    <div style="position:relative;width:${30 * scale}px;height:${30 * scale}px;display:flex;align-items:center;justify-content:center;">
      ${pulse}
      <svg width="${30 * scale}" height="${30 * scale}" viewBox="0 0 30 30" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))">
        <path d="M15 0C7.8 0 2 5.8 2 13c0 9.3 11.4 16.2 12.4 16.8a1 1 0 0 0 1.2 0C16.6 29.2 28 22.3 28 13 28 5.8 22.2 0 15 0z" fill="${color}"/>
        <circle cx="15" cy="13" r="5.5" fill="#0b0d10"/>
      </svg>
    </div>
    <style>@keyframes pulseMap{0%{transform:scale(.7);opacity:.8}100%{transform:scale(2.1);opacity:0}}</style>
  `;
  return L.divIcon({ html, className: "", iconSize: [30 * scale, 30 * scale], iconAnchor: [15 * scale, 29 * scale] });
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 0.6 });
  }, [lat, lng, map]);
  return null;
}

export function MapView({
  professionals,
  selectedId,
  onSelect,
}: {
  professionals: Professional[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const selected = professionals.find((p) => p.id === selectedId);
  return (
    <MapContainer
      center={[-34.6037, -58.3816]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#14171b" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      {professionals.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(p.status, p.id === selectedId)}
          eventHandlers={{ click: () => onSelect?.(p.id) }}
        />
      ))}
      {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
    </MapContainer>
  );
}
