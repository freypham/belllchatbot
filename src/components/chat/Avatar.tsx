export function Avatar() {
  return (
    <figure className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--social-bg)] text-xs font-semibold text-[var(--text-h)]">
      <img
        src="https://ew.com/thmb/F5V6II7EOqq8O7ot7vadpvdQEYo=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Anne-Hathaway-032524-5d707ccf607b45b99b28d6f83a9603b6.jpg"
        alt="Bella"
        className="h-full w-full object-cover"
      />
    </figure>
  );
}
