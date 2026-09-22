import Link from 'next/link';

type LogoVariant = 'on-dark' | 'on-light';

interface RendozLogoProps {
  href?: string;
  variant?: LogoVariant;
  className?: string;
}

export default function RendozLogo({
  href = '/',
  variant = 'on-light',
  className = '',
}: RendozLogoProps) {
  const endozClass = variant === 'on-dark' ? 'text-white' : 'text-slate-700';

  const mark = (
    <span className={`inline-flex items-baseline leading-none ${className}`}>
      <span className="font-extrabold italic text-[28px] sm:text-[32px] text-orange-500">R</span>
      <span className={`font-bold text-[20px] sm:text-[22px] tracking-tight ${endozClass}`}>
        endoz
      </span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex items-center min-h-11" aria-label="Rendoz home">
      {mark}
    </Link>
  );
}
