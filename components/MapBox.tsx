"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { markers } from "@/types/markers";
import MapLegend from "./MapLegend";
import "mapbox-gl/dist/mapbox-gl.css";

/** OSM embed — works without a Mapbox token (shows streets & boundaries). */
function OsmFallbackMap() {
  return (
    <iframe
      title="Zones de service — carte"
      className="absolute inset-0 h-full w-full rounded-lg border-0"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-73.82%2C45.40%2C-73.42%2C45.55&layer=mapnik"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

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

    let zoomAmount = 13;
    let longitudeCorrection = -0.045;
    let latitudeCorrection = 0.053;

    if (window.innerWidth < 700) {
      latitudeCorrection = 0.094;
      longitudeCorrection = -0.082;
      zoomAmount = 12;
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.62, 45.473],
      zoom: zoomAmount,
      pitch: 25,
      bearing: -32,
    });

    mapRef.current.scrollZoom.disable();
    mapRef.current.boxZoom.disable();
    mapRef.current.doubleClickZoom.disable();
    mapRef.current.touchZoomRotate.disable();
    mapRef.current.dragPan.disable();
    mapRef.current.dragRotate.disable();
    mapRef.current.keyboard.disable();

    const map = mapRef.current;
    const resizeMap = () => {
      map.resize();
    };
    map.once("load", resizeMap);
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
            if (!e.status.toLowerCase().includes("completed")) {
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [token]);

  return (
    <div className="relative mt-8 h-[500px]">
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-sm">
        {!token ? (
          <OsmFallbackMap />
        ) : (
          <div
            ref={mapContainerRef}
            className="relative h-full w-full rounded-lg"
          />
        )}
      </div>
      {selectedMarkerInfo && (
        <div className="absolute right-4 top-4 z-50 w-64 rounded-lg bg-white p-4 shadow-md">
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
