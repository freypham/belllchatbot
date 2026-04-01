import { useCallback, useRef } from "react";
import type { PropertyListing } from "../../types/chat";
import { listingId } from "../../lib/listingFields";
import { ListingCard } from "./ListingCard";

type ListingCarouselProps = {
  listings: PropertyListing[];
  onSelectListing: (listing: PropertyListing) => void;
};

function bestMatchIndex(listings: PropertyListing[]): number {
  let best = 0;
  let max = -Infinity;
  listings.forEach((l, i) => {
    const s = l.score;
    if (s == null) return;
    const n = s <= 1 ? s : s / 100;
    if (n > max) {
      max = n;
      best = i;
    }
  });
  return best;
}

export function ListingCarousel({
  listings,
  onSelectListing,
}: ListingCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(280, el.clientWidth * 0.75) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const bestIdx = bestMatchIndex(listings);
  const hasAnyScore = listings.some((l) => l.score != null);

  return (
    <div className="relative mt-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--social-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--social-bg)] to-transparent" />

      <button
        type="button"
        aria-label="Scroll listings left"
        onClick={() => scrollByPage(-1)}
        className="touch-manip absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] shadow-md transition hover:bg-[var(--social-bg)] active:bg-[var(--social-bg)] sm:h-10 sm:w-10"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        aria-label="Scroll listings right"
        onClick={() => scrollByPage(1)}
        className="touch-manip absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] shadow-md transition hover:bg-[var(--social-bg)] active:bg-[var(--social-bg)] sm:h-10 sm:w-10"
      >
        <Chevron direction="right" />
      </button>

      <div
        ref={scrollerRef}
        className="scrollbar-thin flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-12 py-1 [-ms-overflow-style:none] [scrollbar-width:thin] [touch-action:pan-x] sm:gap-4 sm:px-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)]"
      >
        {listings.map((listing, i) => (
          <ListingCard
            key={listingId(listing) ?? `${listing.title}-${i}`}
            listing={listing}
            isBestMatch={
              hasAnyScore && i === bestIdx && listing.score != null
            }
            onOpen={() => onSelectListing(listing)}
          />
        ))}
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-[var(--text-h)]"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
