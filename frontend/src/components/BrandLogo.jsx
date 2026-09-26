export function BrandLogo({ compact = false }) {
  return (
    <span className={compact ? "brand-logo brand-logo-compact" : "brand-logo"} aria-hidden="true">
      <span className="brand-logo-orbit" />
      <span className="brand-logo-line brand-logo-line-one" />
      <span className="brand-logo-line brand-logo-line-two" />
    </span>
  );
}
