import ReactMarkdown from 'react-markdown';

function OutputSection({ data }) {
  const content =
    typeof data === 'string'
      ? data
      : JSON.stringify(data, null, 2);

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-4">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-blue-300 mt-8 mb-3">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-cyan-300 mt-6 mb-2">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="text-slate-300 leading-7 mb-4">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 text-slate-300">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),

          code({ inline, children }) {
            return inline ? (
              <code className="bg-slate-800 px-1.5 py-1 rounded text-cyan-300 text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-slate-950 border border-blue-500/20 rounded-2xl p-4 overflow-x-auto text-sm text-slate-300 my-4">
                <code>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}