import type { PropertyListing } from "../types/chat";

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export function listingId(listing: PropertyListing): string | undefined {
  if (typeof listing.id === "string" && listing.id) return listing.id;
  if (typeof listing.listing_id === "string" && listing.listing_id) {
    return listing.listing_id;
  }
  return undefined;
}

export function listingPrice(listing: PropertyListing): number {
  return asNumber(listing.price) ?? asNumber(listing.price_value) ?? 0;
}

export function listingTypeLabel(listing: PropertyListing): string {
  const broad =
    typeof listing.property_type_broad === "string"
      ? listing.property_type_broad
      : undefined;
  const name =
    typeof listing.property_type_name === "string"
      ? listing.property_type_name
      : undefined;
  const legacy =
    typeof listing.property_type === "string" ? listing.property_type : undefined;
  return broad ?? legacy ?? name ?? "—";
}

export function listingAreaSqft(listing: PropertyListing): number | undefined {
  return asNumber(listing.floor_area_sqft);
}

export function listingBeds(listing: PropertyListing): number | undefined {
  return asNumber(listing.bedrooms);
}

export function listingBaths(listing: PropertyListing): number | undefined {
  return asNumber(listing.bathrooms);
}

export function listingScore(listing: PropertyListing): number | undefined {
  return asNumber(listing.score);
}

export function listingImages(listing: PropertyListing): string[] {
  const fromMedia = Array.isArray(listing.media)
    ? listing.media.filter((v): v is string => typeof v === "string" && v.length > 0)
    : [];
  const fromLegacy =
    typeof listing.image_url === "string" && listing.image_url.length > 0
      ? [listing.image_url]
      : [];
  return [...fromMedia, ...fromLegacy];
}

export function prettyNumber(value: number | undefined): string {
  if (value == null) return "—";
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
}
