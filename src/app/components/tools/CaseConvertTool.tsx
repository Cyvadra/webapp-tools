import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CaseConvertTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState({
    upper: '',
    lower: '',
    capital: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: '',
  });

  const handleConvert = () => {
    if (!input) return;

    const upper = input.toUpperCase();
    const lower = input.toLowerCase();
    const capital = input.replace(/\b\w/g, (c) => c.toUpperCase());

    const words = input.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_-]+/);
    const camelCase = words.map((word, i) =>
      i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
    const pascalCase = words.map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
    const snakeCase = words.map(word => word.toLowerCase()).join('_');
    const kebabCase = words.map(word => word.toLowerCase()).join('-');

    setResults({
      upper,
      lower,
      capital,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
    });
  };

  const ResultItem = ({ label, value }: { label: string; value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-600" />}
          </button>
        </div>
        <div className="font-mono text-sm text-gray-900 break-all">
          {value || '-'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入要转换的文本..."
          className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        onClick={handleConvert}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        转换
      </button>

      <div className="grid grid-cols-2 gap-3">
        <ResultItem label="全部大写 (UPPERCASE)" value={results.upper} />
        <ResultItem label="全部小写 (lowercase)" value={results.lower} />
        <ResultItem label="首字母大写 (Capital Case)" value={results.capital} />
        <ResultItem label="驼峰命名 (camelCase)" value={results.camelCase} />
        <ResultItem label="帕斯卡命名 (PascalCase)" value={results.pascalCase} />
        <ResultItem label="下划线命名 (snake_case)" value={results.snakeCase} />
        <ResultItem label="短横线命名 (kebab-case)" value={results.kebabCase} />
      </div>
    </div>
  );
}
