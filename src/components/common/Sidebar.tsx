import { Author } from "./Author";
import { cn } from "@/lib/utils";
type SidebarProps = {
  layoutClassName?: string;
  elementClassName?: string;
};
export const Sidebar = ({
  layoutClassName,
  elementClassName,
}: SidebarProps) => {
  return (
    <div className={layoutClassName}>
      <div className={cn("flex flex-col gap-5 sticky", elementClassName)}>
        <Author />
      </div>
    </div>
  );
};
