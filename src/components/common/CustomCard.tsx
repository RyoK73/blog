import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CardProps = {
    title: string;
    children: React.ReactNode;
};
export const CustomCard = ({ title, children }: CardProps) => {
    return (
        <Card className="transition-all duration-300 ">
            <CardHeader>
                <CardTitle className="text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};
