import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CSSFormatTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'compress'>('format');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input) return;
    try {
      if (mode === 'format') {
        let formatted = input.replace(/\s+/g, ' ').trim();
        formatted = formatted.replace(/\s*{\s*/g, ' {\n  ');
        formatted = formatted.replace(/\s*}\s*/g, '\n}\n');
        formatted = formatted.replace(/\s*;\s*/g, ';\n  ');
        formatted = formatted.replace(/\s*,\s*/g, ',\n');
        setOutput(formatted);
      } else {
        const compressed = input.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
        setOutput(compressed);
      }
    } catch (error) {
      setOutput('处理失败');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      <div className="flex flex-col">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">输入 CSS 代码</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('format')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mode === 'format'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              格式化
            </button>
            <button
              onClick={() => setMode('compress')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mode === 'compress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              压缩
            </button>
            <button
              onClick={handleProcess}
              className="ml-auto px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              处理
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入 CSS 代码..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">处理结果</label>
          {output && (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-600" />}
              复制
            </button>
          )}
        </div>
        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm overflow-auto whitespace-pre">
          {output || '处理后的代码将显示在这里...'}
        </div>
      </div>
    </div>
  );
}
