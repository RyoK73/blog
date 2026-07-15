import Link from "next/link";

type LinkProps = {
  href: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

export const ExternalLink = ({
  href,
  children,
  ariaLabel,
  className,
}: LinkProps) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </Link>
  );
};
