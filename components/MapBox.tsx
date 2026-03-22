"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { markers } from "@/types/markers";
import MapLegend from "./MapLegend";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<{
    jobType: string;
    status?: string;
    review: string;
  } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error(
        "NEXT_PUBLIC_MAPBOX_TOKEN is not set. Please add it to your .env.local file."
      );
      return;
    }

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
      style: "mapbox://styles/mapbox/streets-v12",
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
        console.log(body);

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
              e.location[1] + latitudeCorrection
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
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="relative h-[500px] mt-8">
      <div
        ref={mapContainerRef}
        className="rounded-lg overflow-hidden w-full h-full shadow-sm relative"
      />
      {selectedMarkerInfo && (
        <div className="absolute top-4 right-4 bg-white shadow-md rounded-lg p-4 z-50 w-64">
          <h3 className="font-semibold text-sm mb-2 text-[#0f1f4b]">
            {selectedMarkerInfo.jobType}
          </h3>
          {selectedMarkerInfo.status && (
            <p className="text-[12px] text-gray-600 mb-2">
              Statut: {selectedMarkerInfo.status}
            </p>
          )}
          {selectedMarkerInfo.review && (
            <div className="flex flex-col mt-3">
              <p className="text-[12px] text-gray-600 mb-2">
                {selectedMarkerInfo.review}
              </p>
              <p className="text-[#f59e0b] text-xs">★★★★★</p>
            </div>
          )}
          <button
            className="mt-3 text-[11px] text-[#2563eb] hover:cursor-pointer transition-colors hover:text-[#1d4ed8]"
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
