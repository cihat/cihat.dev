import { Caption } from "./caption";
import { Code } from "./code";

// Simplified CodeSnippet component for better SSR compatibility
export const CodeSnippet = ({ content, scroll = true, caption = null, lang }) => (
  <div className="my-6">
    <pre className="text-sm max-h-96 overflow-auto">
      <Code lang={lang}>{content}</Code>
    </pre>
    {caption != null ? <Caption>{caption}</Caption> : null}
  </div>
); 
