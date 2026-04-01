import { useEffect, useMemo, useState } from "react";
import type { PropertyListing } from "../../types/chat";
import {
  listingAreaSqft,
  listingBaths,
  listingBeds,
  listingImages,
  listingPrice,
  listingTypeLabel,
  prettyNumber,
} from "../../lib/listingFields";

type ListingDetailModalProps = {
  listing: PropertyListing | null;
  onClose: () => void;
};

function formatMoney(amount: number, currency = "SGD"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function ListingDetailModal({
  listing,
  onClose,
}: ListingDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (!listing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listing, onClose]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [listing]);

  if (!listing) return null;

  const currency = listing.currency ?? "SGD";
  const price = listingPrice(listing);
  const images = listingImages(listing);
  const area = listingAreaSqft(listing);
  const beds = listingBeds(listing);
  const baths = listingBaths(listing);
  const propertyType = listingTypeLabel(listing);
  const tenure =
    typeof listing.tenure === "string" && listing.tenure ? listing.tenure : "—";

  const activeImage = images[activeImageIdx];

  const entries = useMemo(
    () =>
      Object.entries(listing).filter(
        ([k, v]) =>
          v != null &&
          v !== "" &&
          ![
            "image_url",
            "media",
            "price",
            "price_value",
            "bedrooms",
            "bathrooms",
            "floor_area_sqft",
            "property_type",
            "property_type_name",
            "property_type_broad",
            "title",
            "address",
            "tenure",
          ].includes(k) &&
          typeof v !== "object",
      ),
    [listing],
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="listing-modal-title"
            className="text-xl font-semibold text-[var(--text-h)]"
          >
            {listing.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text)] hover:bg-[var(--social-bg)]"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <p className="mb-4 text-2xl font-semibold text-[var(--text-h)]">
          {formatMoney(price, currency)}
        </p>

        {activeImage && (
          <div className="mb-4">
            <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--social-bg)]">
              <img
                src={activeImage}
                alt={listing.title}
                className="h-56 w-full object-cover sm:h-64"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx(
                        (prev) => (prev - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white"
                    aria-label="Previous image"
                  >
                    <Arrow direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white"
                    aria-label="Next image"
                  >
                    <Arrow direction="right" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, idx) => (
                  <button
                    type="button"
                    key={`${src}-${idx}`}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border ${
                      idx === activeImageIdx
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                        : "border-[var(--border)]"
                    }`}
                    aria-label={`Open image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[var(--social-bg)] p-3 text-sm text-[var(--text-h)]">
          <InfoPill
            label="Beds / Baths"
            value={`${prettyNumber(beds)} / ${prettyNumber(baths)}`}
          />
          <InfoPill
            label="Area"
            value={
              area != null ? `${Math.round(area).toLocaleString()} sqft` : "—"
            }
          />
          <InfoPill label="Type" value={propertyType} />
          <InfoPill label="Tenure" value={tenure} />
        </div>

        {listing.description && typeof listing.description === "string" && (
          <p className="mb-4 text-[var(--text)]">{listing.description}</p>
        )}

        <dl className="space-y-2 text-sm">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-wrap justify-between gap-2 border-b border-[var(--border)]/80 py-2 last:border-0"
            >
              <dt className="text-[var(--text)] capitalize">
                {key.replace(/_/g, " ")}
              </dt>
              <dd className="text-right font-medium text-[var(--text-h)]">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-medium text-white shadow-sm hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-[var(--text)]/75">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[var(--text-h)]">{value}</p>
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      {direction === "left" ? (
        <path
          d="M15 18l-6-6 6-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
