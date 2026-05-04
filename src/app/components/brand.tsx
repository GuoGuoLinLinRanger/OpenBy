import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <span className="brand-symbol" aria-hidden="true">
        OB
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="brand-word block">OpenBy</span>
          <span className="mt-1 block text-xs font-medium text-slate-500">Buy timing intelligence</span>
        </span>
      )}
    </Link>
  );
}
