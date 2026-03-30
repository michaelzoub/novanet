"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { setupMapDemarcation } from "@/lib/mapbox-emphasize-boundaries";
import { markers } from "@/types/markers";
import MapLegend from "./MapLegend";
import "mapbox-gl/dist/mapbox-gl.css";

/** OSM embed — works without a Mapbox token. Tighter bbox = higher zoom so roads & area limits read more clearly. */
function OsmFallbackMap() {
  return (
    <iframe
      title="Zones de service — carte"
      className="absolute inset-0 h-full w-full rounded-sm border-0"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-73.78%2C45.42%2C-73.48%2C45.58&layer=mapnik"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

/** Carte : `setupMapDemarcation` charge `/geo/montreal-isle.geojson` (île) + renforce les limites admin. */
export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<{
    jobType: string;
    status?: string;
    review: string;
  } | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !mapContainerRef.current) return;

    mapboxgl.accessToken = token;

    /* Slightly west + closer zoom so NDG / Westmount read clearly */
    let zoomAmount = 10.82;
    let longitudeCorrection = -0.045;
    let latitudeCorrection = 0.053;

    if (window.innerWidth < 700) {
      latitudeCorrection = 0.094;
      longitudeCorrection = -0.082;
      zoomAmount = 9.92;
    }

    const mapStyle =
      process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL?.trim() ||
      "mapbox://styles/mapbox/light-v11";

    /** Pan autorisé, mais limité au Grand Montréal (évite de perdre la zone utile). */
    const maxBoundsGL: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
      [-74.12, 45.2],
      [-73.2, 45.82],
    ];

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [-73.665, 45.508],
      zoom: zoomAmount,
      pitch: 25,
      bearing: -32,
      maxBounds: maxBoundsGL,
    });

    mapRef.current.scrollZoom.disable();
    mapRef.current.boxZoom.disable();
    mapRef.current.doubleClickZoom.disable();
    mapRef.current.touchZoomRotate.disable();
    mapRef.current.dragRotate.disable();
    mapRef.current.keyboard.disable();

    const map = mapRef.current;
    const resizeMap = () => {
      map.resize();
    };
    const applyDemarcation = () => {
      if (!map.isStyleLoaded()) return;
      resizeMap();
      void setupMapDemarcation(map).catch((err) =>
        console.error("[MapBox] délimitation", err),
      );
    };
    map.once("load", applyDemarcation);
    map.once("idle", applyDemarcation);
    window.addEventListener("resize", resizeMap);

    async function loadJobs() {
      const mapCurrent = mapRef.current;
      if (!mapCurrent) {
        return;
      }

      try {
        const response = await fetch("/api/getJobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const body = await response.json();

        if (body.body && Array.isArray(body.body)) {
          body.body.forEach((e: markers) => {
            const st = (e.status ?? "").toLowerCase();
            if (!st.includes("completed")) {
              return;
            }

            const markerElement = document.createElement("div");
            markerElement.className = "custom-marker";
            markerElement.style.backgroundColor = "#ffffff";
            markerElement.style.width = "20px";
            markerElement.style.height = "20px";
            markerElement.style.borderRadius = "50%";
            markerElement.style.border = "2px solid lime";
            markerElement.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
            markerElement.style.cursor = "pointer";

            markerElement.addEventListener("click", () => {
              setSelectedMarkerInfo({
                jobType: e.jobType,
                status: e.status,
                review: e.review,
              });
            });

            const lngLat = new mapboxgl.LngLat(
              e.location[0] + longitudeCorrection,
              e.location[1] + latitudeCorrection,
            );

            const marker = new mapboxgl.Marker({
              element: markerElement,
              anchor: "bottom",
            })
              .setLngLat(lngLat)
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
          });
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    }

    loadJobs();

    return () => {
      window.removeEventListener("resize", resizeMap);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [token]);

  return (
    <div className="relative mt-11 h-[600px] md:mt-8 md:h-[640px]">
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-sm">
        {!token ? (
          <OsmFallbackMap />
        ) : (
          <div
            ref={mapContainerRef}
            className="relative h-full w-full rounded-sm"
          />
        )}
      </div>
      {selectedMarkerInfo && (
        <div className="absolute right-4 top-4 z-50 w-64 rounded-sm bg-white p-4 shadow-md">
          <h3 className="mb-2 text-sm font-semibold text-[#0f1f4b]">
            {selectedMarkerInfo.jobType}
          </h3>
          {selectedMarkerInfo.status && (
            <p className="mb-2 text-[12px] text-gray-600">
              Statut: {selectedMarkerInfo.status}
            </p>
          )}
          {selectedMarkerInfo.review && (
            <div className="mt-3 flex flex-col">
              <p className="mb-2 text-[12px] text-gray-600">
                {selectedMarkerInfo.review}
              </p>
              <p className="text-xs text-[#f59e0b]">★★★★★</p>
            </div>
          )}
          <button
            className="mt-3 text-[11px] text-[#0f1f4b] transition-colors hover:cursor-pointer hover:text-[#152a5a]"
            onClick={() => setSelectedMarkerInfo(null)}
          >
            Fermer
          </button>
        </div>
      )}
      <MapLegend />
    </div>
  );
}
