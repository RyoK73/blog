import { SiZenn, SiGithub, SiX } from "react-icons/si";
import { ExternalLink } from "./ExternalLink";
import { CustomCard } from "./CustomCard";
export const Author = () => {
  return (
    <CustomCard label={"Author"} className="p-6">
      <p className="text-foreground text-left text-sm leading-relaxed">
        Web系ソフトウェアエンジニアを志望
        <br />
        開発記録や個人的な技術に対する思いを綴ります
      </p>
      <table className="[&_td:last-child]:text-foreground mt-4 w-full border-collapse border-t border-b [&_td]:py-2 [&_td:first-child]:border-r [&_td:first-child]:border-dashed [&_td:last-child]:pl-2 [&_tr]:border-b">
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
      <div className="[&_a:hover]:text-vivid flex items-end">
        <div className="text-foreground [&_a]:border-border flex w-1/2 justify-evenly gap-2 pt-3 text-3xl transition [&_a]:border [&_a]:shadow-2xl">
          <ExternalLink
            href="https://x.com/RyoK73EG"
            className="border-flow"
            ariaLabel="X(ホーム)に飛ぶ"
          >
            <SiX />
          </ExternalLink>
          <ExternalLink
            href="https://github.com/RyoK73"
            className="border-flow"
            ariaLabel="GitHub(ホーム)に飛ぶ"
          >
            <SiGithub />
          </ExternalLink>
          <ExternalLink
            href="https://zenn.dev/taruroma"
            className="border-flow"
            ariaLabel="Zenn(ホーム)に飛ぶ"
          >
            <SiZenn />
          </ExternalLink>
        </div>
      </div>
    </CustomCard>
  );
};
