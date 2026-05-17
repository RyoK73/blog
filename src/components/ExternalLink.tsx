import Link from "next/link";

type LinkProps = {
    children?: React.ReactNode;
    linkText: string;
    ariaLabel?: string;
};

export const ExternalLink = ({ children, linkText, ariaLabel }: LinkProps) => {
    return (
        <Link
            href={linkText}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
        >
            {children}
        </Link>
    );
};
