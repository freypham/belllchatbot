export interface PropertyListing {
  id?: string;
  listing_id?: string;
  listing_type?: string;
  title: string;
  price: number;
  price_value?: number;
  psf?: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor_area_sqft?: number;
  address?: string;
  property_type?: string;
  property_type_name?: string;
  property_type_broad?: "Condo" | "HDB" | string;
  district?: string;
  tenure?: string;
  floor_level?: string;
  remaining_lease_years?: number | null;
  score?: number;
  description?: string;
  image_url?: string;
  media?: string[];
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  listings?: PropertyListing[];
}

export interface ChatApiResponse {
  message: string;
  listings?: PropertyListing[];
  session_id: string;
}
