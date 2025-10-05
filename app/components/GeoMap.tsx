"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapPoint = {
  city: string;
  state: string;
  start_date: string;
  end_date?: string | null;
  lat: number;
  lng: number;
};

interface MapProps {
  points: MapPoint[];
}

const GeoMap: React.FC<MapProps> = ({ points }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-98.5795, 39.8283],
      zoom: 3.2,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      // markers
      points.forEach((p) => {
        if (typeof p.lat !== "number" || typeof p.lng !== "number") return;
        const el = document.createElement("div");
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.borderRadius = "9999px";
        el.style.boxShadow = "0 0 12px rgba(52,211,153,0.8)";
        el.style.background =
          "linear-gradient(180deg, #34D399 0%, #20B2AA 100%)";

        const start = new Date(p.start_date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const end = p.end_date
          ? new Date(p.end_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Present";

        new maplibregl.Marker({ element: el })
          .setLngLat([p.lng, p.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 12 }).setHTML(
              `<div style="font-family: Inter, sans-serif; color: #E5E7EB;">
              <div style="font-weight:600; color:#A7F3D0; margin-bottom:4px;">${p.city}, ${p.state}</div>
              <div style="font-size:12px; color:#9CA3AF;">${start} – ${end}</div>
            </div>`
            )
          )
          .addTo(map);
      });

      // path
      const sorted = [...points]
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date));

      if (sorted.length > 1) {
        map.addSource("moves", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: sorted.map((p) => [p.lng, p.lat]),
            },
            properties: {},
          },
        } as any);
        map.addLayer({
          id: "moves-line",
          type: "line",
          source: "moves",
          paint: {
            "line-color": "#34D399",
            "line-width": 2,
            "line-opacity": 0.6,
          },
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [points]);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 rounded-lg border border-slate-700"
    />
  );
};

export default GeoMap;
