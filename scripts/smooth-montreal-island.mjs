/**
 * Nettoie public/geo/montreal-isle.geojson : retire les micro-surfaces,
 * ne garde que l’anneau extérieur de chaque polygone, simplifie les courbes.
 * Pas d’union globale (Turf union en chaîne dégrade la géométrie sur ce jeu).
 * Mapbox remplit toutes les parties comme une seule « île » visuelle.
 */
import * as turf from "@turf/turf";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const target = path.join(root, "public", "geo", "montreal-isle.geojson");

const MIN_FEATURE_M2 = 3_500; // enlève les pointillés aberrants en eau
const simplifyTol = 0.00026;

function outerRingsOnly(geom) {
  if (geom.type === "Polygon") {
    return { type: "Polygon", coordinates: [geom.coordinates[0]] };
  }
  if (geom.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: geom.coordinates.map((poly) => [poly[0]]),
    };
  }
  return geom;
}

function flattenToPolygons(geom) {
  const out = [];
  if (geom.type === "Polygon") {
    out.push(turf.polygon(geom.coordinates));
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.coordinates) {
      out.push(turf.polygon(poly));
    }
  }
  return out;
}

const raw = JSON.parse(fs.readFileSync(target, "utf8"));
if (raw.type !== "FeatureCollection" || !Array.isArray(raw.features)) {
  throw new Error("GeoJSON attendu : FeatureCollection");
}

const featuresOut = [];

for (const f of raw.features) {
  const g = outerRingsOnly(f.geometry);
  const polys = flattenToPolygons(g);
  for (const p of polys) {
    let poly = p;
    try {
      poly = turf.simplify(poly, { tolerance: simplifyTol, highQuality: true });
    } catch {
      /* keep */
    }
    try {
      const a = turf.area(poly);
      if (a < MIN_FEATURE_M2) continue;
    } catch {
      continue;
    }
    featuresOut.push(
      turf.feature(poly.geometry, {
        ...f.properties,
        source:
          "Ville de Montréal — Limites terrestres (CC-BY 4.0), nettoyé localement",
      }),
    );
  }
}

const out = turf.featureCollection(featuresOut);

fs.writeFileSync(target, JSON.stringify(out));
console.log(
  `OK: ${raw.features.length} entités source → ${out.features.length} polygones, ${Buffer.byteLength(JSON.stringify(out))} octets`,
);
