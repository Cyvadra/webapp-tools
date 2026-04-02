import { useState } from 'react';
import xmlFormatter from 'xml-formatter';
import { Copy, Check } from 'lucide-react';

export function XMLFormatTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'compress'>('format');
  const [indentSize, setIndentSize] = useState('2');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) {
      return;
    }

    try {
      if (mode === 'format') {
        setOutput(
          xmlFormatter(input, {
            indentation: ' '.repeat(Math.max(1, Number(indentSize) || 2)),
            collapseContent: true,
            lineSeparator: '\n',
          })
        );
      } else {
        setOutput(input.replace(/>\s+</g, '><').trim());
      }
    } catch (error) {
      setOutput('XML 格式错误，请检查输入内容');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-auto xl:h-[600px]">
      <div className="flex flex-col min-h-[280px] xl:min-h-0">
        <div className="mb-3 space-y-3">
          <label className="block text-sm font-medium text-gray-700">输入 XML</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMode('format')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mode === 'format' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              格式化
            </button>
            <button
              onClick={() => setMode('compress')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mode === 'compress' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              压缩
            </button>
            <input
              type="number"
              min="1"
              max="8"
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value)}
              className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={mode !== 'format'}
            />
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
          placeholder="请输入 XML 内容..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col min-h-[280px] xl:min-h-0">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">输出结果</label>
          {output && !output.startsWith('XML') && (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-600" />}
              复制
            </button>
          )}
        </div>

        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm overflow-auto whitespace-pre-wrap break-all">
          {output || '处理后的 XML 将显示在这里...'}
        </div>
      </div>
    </div>
  );
}
