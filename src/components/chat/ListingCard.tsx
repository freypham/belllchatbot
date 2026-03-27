import type { PropertyListing } from "../../types/chat";

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

function formatScore(score: number): string {
  const pct = score <= 1 ? score * 100 : score;
  return `${Math.round(pct)}%`;
}

type ListingCardProps = {
  listing: PropertyListing;
  isBestMatch?: boolean;
  onOpen: () => void;
};

export function ListingCard({
  listing,
  isBestMatch,
  onOpen,
}: ListingCardProps) {
  const currency = listing.currency ?? "SGD";
  const typeLabel =
    listing.property_type === "HDB" || listing.property_type === "Condo"
      ? listing.property_type
      : listing.property_type ?? "—";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex h-full w-[min(100%,300px)] shrink-0 cursor-pointer snap-start flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition hover:border-[var(--accent-border)] hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="line-clamp-2 flex-1 font-semibold text-[var(--text-h)]">
          {listing.title}
        </h3>
        {listing.score != null && (
          <span className="shrink-0 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
            {formatScore(listing.score)}
          </span>
        )}
      </div>
      {isBestMatch && (
        <span className="mb-2 inline-flex w-fit rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          Best match
        </span>
      )}
      <p className="mb-3 text-lg font-semibold text-[var(--text-h)]">
        {formatMoney(listing.price, currency)}
      </p>
      <dl className="mt-auto space-y-1.5 text-sm text-[var(--text)]">
        <div className="flex justify-between gap-2">
          <dt className="text-[var(--text)]/80">Beds / Baths</dt>
          <dd className="text-[var(--text-h)]">
            {listing.bedrooms ?? "—"} / {listing.bathrooms ?? "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-[var(--text)]/80">Area</dt>
          <dd className="text-[var(--text-h)]">
            {listing.floor_area_sqft != null
              ? `${listing.floor_area_sqft.toLocaleString()} sqft`
              : "—"}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-[var(--text)]/80">Address</dt>
          <dd className="line-clamp-2 text-[var(--text-h)]">
            {listing.address ?? "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-[var(--text)]/80">Type</dt>
          <dd className="text-[var(--text-h)]">{typeLabel}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
        View details
      </p>
    </article>
  );
}
