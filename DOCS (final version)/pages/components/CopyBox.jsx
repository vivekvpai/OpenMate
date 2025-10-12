import { useState } from "react";
import { Copy } from "lucide-react";

// Toast component
function Toast({ message, show }) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 px-4  rounded-4xl text-[14px] shadow-lg font-[400] font-inter border-1 border-gray-600 bg-black text-white transform transition-all duration-500 ease-in-out -translate-x-1/2 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {message}
    </div>
  );
}

// CodeBlock component
function CopyBox({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Toast */}
      <Toast message="Copied to Clipboard!" show={copied} />

      {/* Code Block */}
      <div className="bg-gray-950 text-gray-200 rounded-xl overflow-hidden my-4 ">
        <div className="flex justify-between items-center px-4 py-4 border-b-2 border-b-gray-900">
          <span className="text-sm text-gray-400 font-inter px-3">{language}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <Copy size={16} />
          </button>
        </div>

        <pre className="px-8 py-6 font-mono text-sm whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </>
  );
}

export default CopyBox;
