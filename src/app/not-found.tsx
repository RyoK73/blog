import { cn } from "@/lib/utils";
type NotFoundProps = { className?: string };
const NotFoundPage = ({ className }: NotFoundProps) => {
    return (
        <div className={cn("", className)}>
            <h1>404</h1>
        </div>
    );
};

export default NotFoundPage;
