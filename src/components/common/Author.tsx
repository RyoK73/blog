import { SiZenn, SiGithub, SiX } from "react-icons/si";
import { ExternalLink } from "./ExternalLink";
import { CustomCard } from "./CustomCard";
import Link from "next/link";
export const Author = () => {
    return (
        <CustomCard label={"Author"} className="p-2">
            <p className="text-sm text-foreground leading-relaxed text-left">
                Web系ソフトウェアエンジニアを志望。
                <br />
                開発記録や個人的な技術に対する思いを綴ります。
            </p>
            <table className="border-t border-b w-full border-collapse [&_tr]:border-b [&_td]:py-2 [&_td:first-child]:border-r [&_td:first-child]:border-dashed [&_td:last-child]:pl-2 mt-4">
                <tbody>
                    <tr className="">
                        <td>FOCUS</td>
                        <td>個人開発/設計</td>
                    </tr>
                    <tr>
                        <td>OS</td>
                        <td>Arch Linux+Omarchy</td>
                    </tr>
                    <tr>
                        <td>STACK</td>
                        <td>TypeScript・Next.js</td>
                    </tr>
                    <tr>
                        <td>STATUS</td>
                        <td>学習中 → 就活中</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex items-end">
                <div className="flex text-3xl pt-3 justify-evenly gap-2 w-1/2 transition [&_a]:border [&_a]:border-border shadow-2xl">
                    <ExternalLink
                        linkText="https://x.com/RyoK73EG"
                        className="border-flow"
                    >
                        <SiX />
                    </ExternalLink>
                    <ExternalLink
                        linkText="https://github.com/RyoK73"
                        className="border-flow"
                    >
                        <SiGithub />
                    </ExternalLink>
                    <ExternalLink
                        linkText="https://zenn.dev/dashboard"
                        className="border-flow"
                    >
                        <SiZenn />
                    </ExternalLink>
                </div>
                <Link
                    href="/about"
                    className="border-flow text-base ml-auto px-1"
                >
                    [ About → ]
                </Link>
            </div>
        </CustomCard>
    );
};
