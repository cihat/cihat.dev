import { Caption } from "./caption";
import { Code } from "./code";

export const CodeSnippet = ({ content, scroll = true, caption = null, lang }) => (
  <div className="my-6">
    <pre className="text-sm">
      <Code lang={lang}>{content}</Code>
    </pre>
    {caption != null ? <Caption>{caption}</Caption> : null}
  </div>
) 
