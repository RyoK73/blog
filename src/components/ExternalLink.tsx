import Link from "next/link";

type LinkProps = {
    linkText: string;
    children?: React.ReactNode;
    ariaLabel?: string;
    className?: string;
};

export const ExternalLink = ({
    linkText,
    children,
    ariaLabel,
    className,
}: LinkProps) => {
    return (
        <Link
            href={linkText}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={className}
        >
            {children}
        </Link>
    );
};
