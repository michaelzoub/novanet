/**
 * Fetches public Google Maps reviews via the Places API (Place Details).
 * Requires GOOGLE_MAPS_API_KEY with Places API enabled in Google Cloud Console.
 * @see https://developers.google.com/maps/documentation/places/web-service/details
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

export async function fetchGooglePlaceReviews(): Promise<
  GooglePlacesReview[] | null
> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return null;
  }

  let placeId = process.env.GOOGLE_PLACE_ID?.trim();
  if (!placeId) {
    const query =
      process.env.GOOGLE_PLACE_FIND_QUERY?.trim() ??
      "Nova Net Lavage Extérieur Montreal QC";
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

    if (findData.status !== "OK" || !findData.candidates?.[0]?.place_id) {
      console.error(
        "[Google Places] findplacefromtext:",
        findData.status,
        findData.error_message ?? "",
      );
      return null;
    }
    placeId = findData.candidates[0].place_id;
  }

  const detailsUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json",
  );
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set(
    "fields",
    "reviews,rating,user_ratings_total,name",
  );
  detailsUrl.searchParams.set("key", apiKey);

  const detailsRes = await fetch(detailsUrl.toString());
  const detailsData = (await detailsRes.json()) as {
    status: string;
    error_message?: string;
    result?: PlaceDetailsResult;
  };

  if (detailsData.status !== "OK" || !detailsData.result) {
    console.error(
      "[Google Places] details:",
      detailsData.status,
      detailsData.error_message ?? "",
    );
    return null;
  }

  const list = detailsData.result.reviews ?? [];
  return list.map((r, i) => ({
    id: `google-${r.time ?? i}-${i}`,
    name: (r.author_name ?? "Google user").trim() || "Google user",
    rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 5))),
    text: (r.text ?? "").trim(),
    date: r.relative_time_description,
    source: "google" as const,
  }));
}
