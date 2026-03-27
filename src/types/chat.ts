export interface PropertyListing {
  id?: string;
  title: string;
  price: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor_area_sqft?: number;
  address?: string;
  property_type?: string;
  score?: number;
  description?: string;
  image_url?: string;
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
