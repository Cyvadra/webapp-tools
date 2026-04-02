import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function JSFormatTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input) return;
    try {
      let formatted = input;
      let indentLevel = 0;
      const indentSize = 2;
      let result = '';
      let inString = false;
      let stringChar = '';

      for (let i = 0; i < formatted.length; i++) {
        const char = formatted[i];
        const prevChar = i > 0 ? formatted[i - 1] : '';

        if ((char === '"' || char === "'") && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
          result += char;
          continue;
        }

        if (inString) {
          result += char;
          continue;
        }

        if (char === '{' || char === '[') {
          result += char + '\n';
          indentLevel++;
          result += ' '.repeat(indentLevel * indentSize);
        } else if (char === '}' || char === ']') {
          result += '\n';
          indentLevel--;
          result += ' '.repeat(indentLevel * indentSize) + char;
        } else if (char === ';') {
          result += char + '\n';
          if (indentLevel > 0) {
            result += ' '.repeat(indentLevel * indentSize);
          }
        } else if (char === ',') {
          result += char + '\n';
          if (indentLevel > 0) {
            result += ' '.repeat(indentLevel * indentSize);
          }
        } else if (char === '\n' || char === '\r') {
          continue;
        } else {
          result += char;
        }
      }

      setOutput(result);
    } catch (error) {
      setOutput('格式化失败');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">输入 JavaScript 代码</label>
          <button
            onClick={handleFormat}
            className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            格式化
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入 JavaScript 代码..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">格式化结果</label>
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
          {output || '格式化后的代码将显示在这里...'}
        </div>
      </div>
    </div>
  );
}
