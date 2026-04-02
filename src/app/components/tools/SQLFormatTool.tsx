import { useState } from 'react';
import { format } from 'sql-formatter';
import { Copy, Check } from 'lucide-react';

const dialects = [
  { label: '标准 SQL', value: 'sql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'SQL Server', value: 'transactsql' },
  { label: 'PL/SQL', value: 'plsql' },
] as const;

export function SQLFormatTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'compress'>('format');
  const [dialect, setDialect] = useState<(typeof dialects)[number]['value']>('sql');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) {
      return;
    }

    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: 2,
        keywordCase: 'upper',
      });

      if (mode === 'format') {
        setOutput(formatted);
      } else {
        setOutput(formatted.replace(/\s+/g, ' ').trim());
      }
    } catch (error) {
      setOutput('SQL 语法有误，无法完成处理');
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
          <label className="block text-sm font-medium text-gray-700">输入 SQL</label>
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
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as (typeof dialects)[number]['value'])}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dialects.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
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
          placeholder="请输入 SQL 语句..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col min-h-[280px] xl:min-h-0">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">输出结果</label>
          {output && !output.startsWith('SQL') && (
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
          {output || '处理后的 SQL 将显示在这里...'}
        </div>
      </div>
    </div>
  );
}
