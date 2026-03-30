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

export async function setupMapDemarcation(map: mapboxgl.Map) {
  try {
    emphasizeAdministrativeBoundaries(map);
    await addNovaNetServiceAreaOutline(map);
  } catch (e) {
    console.error("[Mapbox] setupMapDemarcation", e);
  }
}
