import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"; // CardConentのpaddingをリセットするため、p-0を適用している
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
        "border-border bg-content-background relative rounded-none border p-3 ring-0",
        className,
      )}
    >
      <CardHeader className="gap-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="bg-background text-vivid absolute -top-3 z-10 px-1 font-medium">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};
