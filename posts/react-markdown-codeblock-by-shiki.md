---
title: react-markdownのコードブロックをshikiで実装する
date: 2026-05-26
category: tech
published: false
---

## 本日のテーマ

[react-markdown](https://github.com/remarkjs/react-markdown)でmarkdownをレンダリングする際、コードブロックをコピーボタン付きの[shiki](https://shiki.style)製シンタックスハイライトに差し替えたい。

### 欲しい物

- シンタックスハイライト
- コピーボタン

## CodeBlockコンポーネントを作成する

### 1. rect-markdownのコードブロック,インラインコードの生成方法を調べる

開発者ツールを使ってコードブロック部分を選択すると以下のように記載がある。

```html
<pre>
        <code class="language-ts">    const txt = "text"
        console.log(txt)
        </code>
    </pre>
```

そのため、コードブロックを差し替える際は以下のように記述する。

```ts
    // CodeBlockはコンポーネント
    <Markdown
        remarkPlugins={[[remarkGfm]]}
        conponents={{
            pre:CodeBlock
        }}
    >

```

### 2. preに渡されるPropsの内容を確認する

↓のようなコードを書いてターミナルで見る

```ts
    import consola from "consola"
    ---
    <Markdown
        remarkPlugins={[[remarkGfm]]}
        components={{
            pre: (props) => {
                consola.info(props);
                return <code>{props.children}</code>;
            },
        }}
    >


```

こういうのが返ってくる。

```ts
    ℹ { node:                                                             21:47:15
       { type: 'element',
         tagName: 'pre',
         properties: {},
         children: [ [Object] ],
         position: { start: [Object], end: [Object] } },
      children:
       { '$$typeof': Symbol(react.transitional.element),
         type: 'code',
         key: 'code-0',
         props:
          { className: 'language-ts',
            children:
             '    import consola from "consola"\n    ---\n    <Markdown\n        remarkPlugins={[[remarkGfm]]}\n        components={{\n            pre: (props) => {\n                consola.info(props);\n                return <code>{props.children}</code>;\n            },\n        }}\n    >\n\n' },...
```

`consola`はめっちゃ便利な`console.log`ライブラリ。また記事書くかも。

なので`CodeBlock`の受け取る引数の型定義はこう

```ts
type CodeProps = {
    children: {
        type: string;
        props: {
            className?: string;
            children: string;
        };
    };
};
```

基本形はこう

```ts
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

```
