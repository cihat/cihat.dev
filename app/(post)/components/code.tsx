import SyntaxHighlighter from 'react-syntax-highlighter';

export const Code = ({ children, lang }) => {

  if (!lang) {
    return (
      <code
        className={`
        rounded-md 
        [p_&]:text-sm
        [p_&]:px-1
        [p_&]:py-0.5
        [p_&]:rounded-sm
        [p_&]:bg-gray-200
        dark:[p_&]:bg-[#333]
      `}
      >
        {children}
      </code>
    )
  }
  return (
    <SyntaxHighlighter language={lang} showLineNumbers={true} className="rounded-md">
      {children}
    </SyntaxHighlighter>
  );
};
