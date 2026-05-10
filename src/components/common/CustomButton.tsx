import { cn } from "@/lib/utils";

type ButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
};
export const CustomButton = ({ children, onClick, className }: ButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "text-3xl p-2 transition hover:scale-120 active:scale-95 duration-500",
                className,
            )}
        >
            {children}
        </button>
    );
};
