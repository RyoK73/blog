import { Author } from "./Author";
import { cn } from "@/lib/utils";
type SidebarProps = {
    className?: string;
};
export const Sidebar = ({ className }: SidebarProps) => {
    return (
        <div className={cn("shrink-0 flex flex-col gap-5", className)}>
            <Author />
        </div>
    );
};
