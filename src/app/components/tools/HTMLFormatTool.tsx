import { useState } from 'react';
import { CopyButton } from '../CopyButton';
import { formatHtml } from '../../utils/htmlFormatter';

export function HTMLFormatTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = () => {
    if (!input.trim()) return;

    try {
      setOutput(formatHtml(input));
    } catch {
      setOutput('格式化失败');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      <div className="flex flex-col">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">输入 HTML 代码</label>
          <button
            onClick={handleFormat}
            className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            格式化
          </button>
        </div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="请输入 HTML 代码..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">格式化结果</label>
          {output && (
            <CopyButton
              value={output}
              label="复制"
              iconClassName="w-3 h-3"
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            />
          )}
        </div>
        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm overflow-auto whitespace-pre">
          {output || '格式化后的代码将显示在这里...'}
        </div>
      </div>
    </div>
  );
}
