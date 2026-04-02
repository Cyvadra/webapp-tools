import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function RemoveDuplicateTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });
  const [options, setOptions] = useState({
    removeDuplicate: true,
    sort: false,
    removeEmpty: true,
    trim: true,
  });
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input) return;

    let lines = input.split('\n');
    const originalCount = lines.length;

    if (options.trim) {
      lines = lines.map(line => line.trim());
    }

    if (options.removeEmpty) {
      lines = lines.filter(line => line.length > 0);
    }

    if (options.removeDuplicate) {
      lines = Array.from(new Set(lines));
    }

    if (options.sort) {
      lines.sort((a, b) => a.localeCompare(b, 'zh-CN'));
    }

    const uniqueCount = lines.length;
    const removedCount = originalCount - uniqueCount;

    setOutput(lines.join('\n'));
    setStats({ original: originalCount, unique: uniqueCount, removed: removedCount });
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
          <label className="block text-sm font-medium text-gray-700 mb-2">输入文本（每行一条）</label>
          <div className="space-y-2 mb-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options.removeDuplicate}
                onChange={(e) => setOptions({ ...options, removeDuplicate: e.target.checked })}
                className="rounded"
              />
              去除重复行
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options.sort}
                onChange={(e) => setOptions({ ...options, sort: e.target.checked })}
                className="rounded"
              />
              排序
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options.removeEmpty}
                onChange={(e) => setOptions({ ...options, removeEmpty: e.target.checked })}
                className="rounded"
              />
              删除空行
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options.trim}
                onChange={(e) => setOptions({ ...options, trim: e.target.checked })}
                className="rounded"
              />
              去除首尾空格
            </label>
          </div>
          <button
            onClick={handleProcess}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            处理
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="每行输入一条数据..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
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
          {output && (
            <div className="flex gap-4 text-sm text-gray-600 mb-2">
              <span>原始: {stats.original} 行</span>
              <span>结果: {stats.unique} 行</span>
              <span className="text-red-600">删除: {stats.removed} 行</span>
            </div>
          )}
        </div>
        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm overflow-auto whitespace-pre">
          {output || '处理后的结果将显示在这里...'}
        </div>
      </div>
    </div>
  );
}
