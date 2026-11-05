import { useState } from 'react';
import { CopyButton } from '../CopyButton';

interface CaseResult {
  label: string;
  value: string;
}

function ResultItem({ label, value }: CaseResult) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <CopyButton
          value={value}
          iconClassName="w-3 h-3"
          className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        />
      </div>
      <div className="font-mono text-sm text-gray-900 break-all">{value || '-'}</div>
    </div>
  );
}

export function CaseConvertTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<CaseResult[]>([]);

  const handleConvert = () => {
    if (!input) return;

    const upper = input.toUpperCase();
    const lower = input.toLowerCase();
    const capital = input.replace(/\b\w/g, (character) => character.toUpperCase());

    const words = input.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_-]+/);
    const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    const camelCase = words
      .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
      .join('');
    const pascalCase = words.map(capitalize).join('');
    const snakeCase = words.map((word) => word.toLowerCase()).join('_');
    const kebabCase = words.map((word) => word.toLowerCase()).join('-');

    setResults([
      { label: '全部大写 (UPPERCASE)', value: upper },
      { label: '全部小写 (lowercase)', value: lower },
      { label: '首字母大写 (Capital Case)', value: capital },
      { label: '驼峰命名 (camelCase)', value: camelCase },
      { label: '帕斯卡命名 (PascalCase)', value: pascalCase },
      { label: '下划线命名 (snake_case)', value: snakeCase },
      { label: '短横线命名 (kebab-case)', value: kebabCase },
    ]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
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
        {results.map((result) => (
          <ResultItem key={result.label} {...result} />
        ))}
      </div>
    </div>
  );
}
