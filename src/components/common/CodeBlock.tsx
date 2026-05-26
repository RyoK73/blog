import { codeToHtml, bundledLanguages } from "shiki";
type CodeProps = {
    children: {
        type: string;
        props: {
            className?: string;
            children: string;
        };
    };
};

const isValidLanguage = (lang: string) => {
    return lang in bundledLanguages;
};

export const CodeBlock = async ({ children }: CodeProps) => {
    if (children.type !== "code") return <pre>{children.props.children}</pre>;
    const lang = children.props.className
        ? children.props.className.replace("language-", "")
        : "text";

    const code = children.props.children;
    const html = await codeToHtml(code, {
        lang: isValidLanguage(lang) ? lang : "txt",
        theme: "dark-plus",
    });

    return (
        <div>
            <CopyButton code={code} />
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};
