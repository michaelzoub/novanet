/**
 * Google Places — avis pour la section Témoignages.
 *
 * Variables d’environnement :
 * - GOOGLE_MAPS_API_KEY ou GOOGLE_PLACES_API_KEY (même clé possible)
 * - GOOGLE_PLACE_ID (recommandé : id ChIJ… de la fiche Google Business)
 * - Si seule « Places API (New) » est activée : définissez GOOGLE_PLACE_ID ;
 *   la recherche texte legacy peut être refusée.
 *
 * Côté serveur (Vercel), la clé ne doit PAS être limitée aux seuls référents HTTP
 * du navigateur : utilisez « Applications » = Aucune restriction, ou restriction par IP,
 * et limitez plutôt les **API** (Places API / Places API New).
 *
 * @see https://developers.google.com/maps/documentation/places/web-service/details
 * @see https://developers.google.com/maps/documentation/places/web-service/place-details
 */

export type GooglePlacesReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  jobType?: string;
  date?: string;
  source: "google";
};

type PlaceDetailsReview = {
  author_name?: string;
  rating?: number;
  text?: string;
  time?: number;
  relative_time_description?: string;
};

type PlaceDetailsResult = {
  name?: string;
  reviews?: PlaceDetailsReview[];
  rating?: number;
  user_ratings_total?: number;
};

export type GooglePlaceDetailsPayload = {
  reviews: GooglePlacesReview[];
  placeRating?: number;
  userRatingsTotal?: number;
  placeName?: string;
};

function resolveGoogleMapsApiKey(): string | null {
  const k =
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.GOOGLE_PLACES_API_KEY?.trim();
  return k || null;
}

function mapLegacyResult(res: PlaceDetailsResult): GooglePlaceDetailsPayload {
  const list = res.reviews ?? [];
  const reviews = list.map((r, i) => ({
    id: `google-${r.time ?? i}-${i}`,
    name: (r.author_name ?? "Google user").trim() || "Google user",
    rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 5))),
    text: (r.text ?? "").trim(),
    date: r.relative_time_description,
    source: "google" as const,
  }));

  return {
    reviews,
    placeRating: res.rating,
    userRatingsTotal: res.user_ratings_total,
    placeName: res.name,
  };
}

/** Places API (New) — GET /v1/places/{placeId} */
async function fetchPlaceDetailsNew(
  placeId: string,
  apiKey: string,
): Promise<GooglePlaceDetailsPayload | null> {
  const url = new URL(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
  );
  url.searchParams.set("languageCode", "fr");

  const res = await fetch(url.toString(), {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews,rating,userRatingCount,displayName",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.warn("[Google Places v1] HTTP", res.status, body.slice(0, 400));
    return null;
  }

  const data = (await res.json()) as {
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    reviews?: Array<{
      rating?: number;
      relativePublishTimeDescription?: string;
      text?: { text?: string };
      originalText?: { text?: string };
      authorAttribution?: { displayName?: string };
      publishTime?: string;
    }>;
  };

  const list = data.reviews ?? [];
  const reviews = list.map((r, i) => {
    const text = (
      r.text?.text ??
      r.originalText?.text ??
      ""
    ).trim();
    const name =
      (r.authorAttribution?.displayName ?? "Google user").trim() ||
      "Google user";
    return {
      id: `google-v1-${r.publishTime ?? i}-${i}`,
      name,
      rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 5))),
      text,
      date: r.relativePublishTimeDescription,
      source: "google" as const,
    };
  });

  return {
    reviews,
    placeRating: data.rating,
    userRatingsTotal: data.userRatingCount,
    placeName: data.displayName?.text,
  };
}

async function resolvePlaceId(apiKey: string): Promise<string | null> {
  const configured = process.env.GOOGLE_PLACE_ID?.trim();
  if (configured) {
    return configured;
  }

  const query =
    process.env.GOOGLE_PLACE_FIND_QUERY?.trim() ??
    "Nova Net Lavage Extérieur Montréal QC";

  const findUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
  );
  findUrl.searchParams.set("input", query);
  findUrl.searchParams.set("inputtype", "textquery");
  findUrl.searchParams.set("fields", "place_id,formatted_address,name");
  findUrl.searchParams.set("key", apiKey);

  const findRes = await fetch(findUrl.toString());
  const findData = (await findRes.json()) as {
    status: string;
    error_message?: string;
    candidates?: { place_id?: string }[];
  };

  if (findData.status === "OK" && findData.candidates?.[0]?.place_id) {
    return findData.candidates[0].place_id;
  }

  console.warn(
    "[Google Places] findplacefromtext:",
    findData.status,
    findData.error_message ?? "",
    "— text search…",
  );

  const tsUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/textsearch/json",
  );
  tsUrl.searchParams.set("query", query);
  tsUrl.searchParams.set("key", apiKey);

  const tsRes = await fetch(tsUrl.toString());
  const tsData = (await tsRes.json()) as {
    status: string;
    error_message?: string;
    results?: { place_id?: string }[];
  };

  if (tsData.status === "OK" && tsData.results?.[0]?.place_id) {
    return tsData.results[0].place_id;
  }

  console.error(
    "[Google Places] textsearch:",
    tsData.status,
    tsData.error_message ?? "",
  );
  return null;
}

async function fetchLegacyPlaceDetails(
  placeId: string,
  apiKey: string,
): Promise<GooglePlaceDetailsPayload | null> {
  const detailsUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json",
  );
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set(
    "fields",
    "reviews,rating,user_ratings_total,name",
  );
  detailsUrl.searchParams.set("language", "fr");
  detailsUrl.searchParams.set("key", apiKey);

  const detailsRes = await fetch(detailsUrl.toString());
  const detailsData = (await detailsRes.json()) as {
    status: string;
    error_message?: string;
    result?: PlaceDetailsResult;
  };

  if (detailsData.status === "OK" && detailsData.result) {
    return mapLegacyResult(detailsData.result);
  }

  console.warn(
    "[Google Places] legacy details:",
    detailsData.status,
    detailsData.error_message ?? "",
    "— trying Places API (New)…",
  );
  return null;
}

/**
 * Détail du lieu : d’abord Places API classique, puis Places API (New) si échec.
 */
export async function fetchGooglePlaceDetails(): Promise<
  GooglePlaceDetailsPayload | null
> {
  const apiKey = resolveGoogleMapsApiKey();
  if (!apiKey) {
    return null;
  }

  const placeId = await resolvePlaceId(apiKey);
  if (!placeId) {
    console.error(
      "[Google Places] Impossible de résoudre place_id. Définissez GOOGLE_PLACE_ID.",
    );
    return null;
  }

  const legacy = await fetchLegacyPlaceDetails(placeId, apiKey);
  if (legacy) {
    return legacy;
  }

  return fetchPlaceDetailsNew(placeId, apiKey);
}
