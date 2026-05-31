import { codeToHtml, bundledLanguages } from "shiki";
import CopyButton from "./CopyButton";
import { ReactElement } from "react";

type CodeBlockChildren = ReactElement<{
    className?: string;
    children: React.ReactNode;
}>;
type CodeProps = {
    children: CodeBlockChildren;
};

const isValidLanguage = (lang: string) => {
    return lang in bundledLanguages;
};

export const CodeBlock = async ({ children }: CodeProps) => {
    if (children.type !== "code") return <pre>{children.props.children}</pre>;
    const lang = children.props.className
        ? children.props.className.replace("language-", "")
        : "text";

    const code = String(children.props.children);
    const html = await codeToHtml(code, {
        lang: isValidLanguage(lang) ? lang : "txt",
        theme: "dark-plus",
    });

    return (
        <div className="relative">
            <div className="" dangerouslySetInnerHTML={{ __html: html }} />
            <CopyButton
                className="absolute top-5 right-5 duration-300"
                code={code}
            />
        </div>
    );
};

export default CodeBlock;
