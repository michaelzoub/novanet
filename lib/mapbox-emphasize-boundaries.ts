import type mapboxgl from "mapbox-gl";

/** Fallback rectangle si `/geo/montreal-isle.geojson` est introuvable. */
const SERVICE_AREA_FALLBACK: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zone de service Nova Net (approx.)" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.82, 45.4],
            [-73.45, 45.4],
            [-73.45, 45.68],
            [-73.82, 45.68],
            [-73.82, 45.4],
          ],
        ],
      },
    },
  ],
};

const SOURCE_ID = "novanet-service-area";
const FILL_LAYER_ID = "novanet-service-area-fill";
const LINE_LAYER_ID = "novanet-service-area-line";

const ISLAND_GEOJSON_URL = "/geo/montreal-isle.geojson";

function firstSymbolLayerId(map: mapboxgl.Map): string | undefined {
  const layers = map.getStyle()?.layers;
  if (!layers) return undefined;
  const sym = layers.find((l) => l.type === "symbol");
  return sym?.id;
}

async function loadServiceAreaGeoJson(): Promise<GeoJSON.FeatureCollection> {
  try {
    const res = await fetch(ISLAND_GEOJSON_URL);
    if (!res.ok) return SERVICE_AREA_FALLBACK;
    const json = (await res.json()) as unknown;
    if (
      json &&
      typeof json === "object" &&
      (json as GeoJSON.FeatureCollection).type === "FeatureCollection" &&
      Array.isArray((json as GeoJSON.FeatureCollection).features) &&
      (json as GeoJSON.FeatureCollection).features.length > 0
    ) {
      return json as GeoJSON.FeatureCollection;
    }
  } catch {
    /* use fallback */
  }
  return SERVICE_AREA_FALLBACK;
}

/**
 * Contour en pointillés + léger remplissage (île de Montréal ou fallback),
 * inséré sous les labels.
 */
export async function addNovaNetServiceAreaOutline(map: mapboxgl.Map) {
  if (map.getSource(SOURCE_ID)) return;

  const data = await loadServiceAreaGeoJson();
  const beforeId = firstSymbolLayerId(map);

  map.addSource(SOURCE_ID, {
    type: "geojson",
    data,
  });

  const fillLayer: mapboxgl.AnyLayer = {
    id: FILL_LAYER_ID,
    type: "fill",
    source: SOURCE_ID,
    paint: {
      "fill-color": "#0f1f4b",
      "fill-opacity": 0.14,
    },
  };

  const lineLayer: mapboxgl.AnyLayer = {
    id: LINE_LAYER_ID,
    type: "line",
    source: SOURCE_ID,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#0f1f4b",
      "line-width": 3,
      "line-dasharray": [1.8, 1.15],
      "line-opacity": 0.95,
    },
  };

  if (beforeId) {
    map.addLayer(fillLayer, beforeId);
    map.addLayer(lineLayer, beforeId);
  } else {
    map.addLayer(fillLayer);
    map.addLayer(lineLayer);
  }
}

export function emphasizeAdministrativeBoundaries(map: mapboxgl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    if (layer.type !== "line") continue;
    const id = layer.id.toLowerCase();
    if (
      !id.includes("boundary") &&
      !id.includes("admin") &&
      !id.includes("disputed") &&
      !id.includes("country") &&
      !id.includes("state")
    ) {
      continue;
    }
    try {
      map.setLayoutProperty(layer.id, "visibility", "visible");
    } catch {
      /* ignore */
    }
    try {
      map.setPaintProperty(layer.id, "line-color", "#0f1f4b");
    } catch {
      /* data-driven paint */
    }
    try {
      map.setPaintProperty(layer.id, "line-opacity", 0.72);
    } catch {
      /* ignore */
    }
    try {
      map.setPaintProperty(layer.id, "line-width", 2);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Single priority zone = union of the former NDG + Westmount rectangles,
 * same bbox, corners filleted (ellipse in lng/lat for a rounder on-screen look).
 */
function buildPriorityZoneRoundedPolygon(): GeoJSON.FeatureCollection {
  const west = -73.648;
  const south = 45.458;
  const east = -73.575;
  const north = 45.512;
  const rx = Math.min(0.0115, (east - west) * 0.26);
  const ry = Math.min(0.0085, (north - south) * 0.26);
  const steps = 12;

  const arc = (
    cx: number,
    cy: number,
    a0: number,
    a1: number,
    skipFirst: boolean,
  ): GeoJSON.Position[] => {
    const out: GeoJSON.Position[] = [];
    const start = skipFirst ? 1 : 0;
    for (let i = start; i <= steps; i++) {
      const t = a0 + ((a1 - a0) * i) / steps;
      out.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
    }
    return out;
  };

  const ring: GeoJSON.Position[] = [
    [west + rx, south],
    [east - rx, south],
    ...arc(east - rx, south + ry, -Math.PI / 2, 0, true),
    [east, north - ry],
    ...arc(east - rx, north - ry, 0, Math.PI / 2, true),
    [west + rx, north],
    ...arc(west + rx, north - ry, Math.PI / 2, Math.PI, true),
    [west, south + ry],
    ...arc(west + rx, south + ry, Math.PI, 1.5 * Math.PI, true),
    [west + rx, south],
  ];

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "NDG & Westmount (priorité)" },
        geometry: { type: "Polygon", coordinates: [ring] },
      },
    ],
  };
}

const PRIORITY_ZONES_GEOJSON = buildPriorityZoneRoundedPolygon();

const PRIORITY_SOURCE_ID = "novanet-priority-zones";
const PRIORITY_FILL_LAYER_ID = "novanet-priority-zones-fill";
const PRIORITY_LINE_LAYER_ID = "novanet-priority-zones-line";

function addPriorityNeighborhoodsHighlight(map: mapboxgl.Map) {
  if (map.getSource(PRIORITY_SOURCE_ID)) return;

  const beforeId = firstSymbolLayerId(map);

  map.addSource(PRIORITY_SOURCE_ID, {
    type: "geojson",
    data: PRIORITY_ZONES_GEOJSON,
  });

  const fillLayer: mapboxgl.AnyLayer = {
    id: PRIORITY_FILL_LAYER_ID,
    type: "fill",
    source: PRIORITY_SOURCE_ID,
    paint: {
      "fill-color": "#60a5fa",
      "fill-opacity": 0.32,
    },
  };

  const lineLayer: mapboxgl.AnyLayer = {
    id: PRIORITY_LINE_LAYER_ID,
    type: "line",
    source: PRIORITY_SOURCE_ID,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#3b82f6",
      "line-width": 1.5,
      "line-opacity": 0.75,
    },
  };

  if (beforeId) {
    map.addLayer(fillLayer, beforeId);
    map.addLayer(lineLayer, beforeId);
  } else {
    map.addLayer(fillLayer);
    map.addLayer(lineLayer);
  }
}

export async function setupMapDemarcation(map: mapboxgl.Map) {
  try {
    emphasizeAdministrativeBoundaries(map);
    await addNovaNetServiceAreaOutline(map);
    addPriorityNeighborhoodsHighlight(map);
  } catch (e) {
    console.error("[Mapbox] setupMapDemarcation", e);
  }
}
