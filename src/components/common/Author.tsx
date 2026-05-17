import { FaXTwitter } from "react-icons/fa6";
import { VscGithubAlt } from "react-icons/vsc";
import Link from "next/link";
import { CustomCard } from "./CustomCard";
export const Author = () => {
    return (
        <CustomCard label={"Author"}>
            <p className="text-sm text-foreground leading-relaxed text-left">
                Web系ソフトウェアエンジニアを志望。
                <br />
                開発記録や個人的な技術に対する思いを綴ります。
            </p>
            <table className="border-t border-b w-full border-collapse [&_tr]:border-b [&_td]:py-2 [&_td:first-child]:border-r [&_td:first-child]:border-dashed [&_td:last-child]:pl-2 mt-4">
                <tbody>
                    <tr className="">
                        <td className="">FOCUS</td>
                        <td className="">個人開発/設計</td>
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
                        <td>学習中→就活中</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex text-4xl pt-3 justify-evenly gap-2 transition [&_a:hover]:opacity-20 [&_a:hover]:duration-300 ">
                <Link href="">
                    <FaXTwitter />
                </Link>
                <Link href="">
                    <VscGithubAlt />
                </Link>
            </div>
        </CustomCard>
    );
};
