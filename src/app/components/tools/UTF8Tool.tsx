import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function UTF8Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input) return;
    try {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(input);
      const hex = Array.from(encoded)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ');
      setOutput(hex.toUpperCase());
    } catch (error) {
      setOutput('转换失败');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入要转换的文本..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        onClick={handleConvert}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        转换为 UTF-8 字节
      </button>

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">UTF-8 字节 (十六进制)</label>
          <div className="relative">
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm break-all max-h-64 overflow-y-auto">
              {output}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
