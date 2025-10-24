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
  
  // Simple code block without syntax highlighting to avoid SSR issues
  return (
    <pre className="rounded-md bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto text-sm">
      <code className="text-gray-800 dark:text-gray-200">{children}</code>
    </pre>
  );
};
