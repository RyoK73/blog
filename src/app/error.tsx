"use client";
import { cn } from "@/lib/utils";
type ErrorProps = { className?: string };
const ErrorPage = ({ className }: ErrorProps) => {
    return (
        <div className={cn("", className)}>
            <h1>500</h1>
        </div>
    );
};

export default ErrorPage;
