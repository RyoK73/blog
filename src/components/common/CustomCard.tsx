import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

type CardProps = {
    title?: string;
    label?: string;
    children: React.ReactNode;
    className?: string;
};
export const CustomCard = ({
    title,
    label,
    children,
    className,
}: CardProps) => {
    return (
        <Card
            className={cn(
                "relative border border-border rounded-none bg-content-background p-3",
                className,
            )}
        >
            <CardHeader className="gap-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription className="absolute -top-3 px-1 z-10 bg-background text-vivid font-medium">
                    {label}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
};
