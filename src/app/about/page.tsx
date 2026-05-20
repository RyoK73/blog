import { cn } from "@/lib/utils";
type AboutProp = { className?: string };
const AboutPage = ({ className }: AboutProp) => {
    return (
        <div className={cn("", className)}>
            <h1>Aboutページです。</h1>
        </div>
    );
};

export default AboutPage;
