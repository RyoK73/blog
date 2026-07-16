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
        "p-2 text-3xl transition duration-500 hover:scale-120 active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
};
