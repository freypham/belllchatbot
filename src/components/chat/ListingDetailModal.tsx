import { useEffect } from "react";
import type { PropertyListing } from "../../types/chat";

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
  useEffect(() => {
    if (!listing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listing, onClose]);

  if (!listing) return null;

  const currency = listing.currency ?? "SGD";
  const entries = Object.entries(listing).filter(
    ([k, v]) =>
      v != null &&
      v !== "" &&
      !["image_url"].includes(k) &&
      typeof v !== "object",
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

        <p className="mb-6 text-2xl font-semibold text-[var(--text-h)]">
          {formatMoney(listing.price, currency)}
        </p>

        {listing.image_url && typeof listing.image_url === "string" && (
          <img
            src={listing.image_url}
            alt=""
            className="mb-4 max-h-48 w-full rounded-xl object-cover"
          />
        )}

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
