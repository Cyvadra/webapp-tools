import { useState } from 'react';
import { Play } from 'lucide-react';

export function RegexTestTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [error, setError] = useState('');

  const handleTest = () => {
    if (!pattern) {
      setError('请输入正则表达式');
      return;
    }

    try {
      const flagsStr = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');
      const regex = new RegExp(pattern, flagsStr);
      const result = testString.match(regex);
      setMatches(result);
      setError('');
    } catch (err) {
      setError('正则表达式格式错误');
      setMatches(null);
    }
  };

  const highlightMatches = () => {
    if (!matches || matches.length === 0) return testString;

    let result = testString;
    const matchSet = new Set(matches);
    matchSet.forEach((match) => {
      result = result.replace(
        new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        `<mark class="bg-yellow-200 px-1 rounded">${match}</mark>`
      );
    });
    return result;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">正则表达式</label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3">
            <span className="text-gray-400 mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="请输入正则表达式"
              className="flex-1 py-2 focus:outline-none font-mono"
            />
            <span className="text-gray-400 ml-1">/</span>
          </div>
          <div className="flex gap-2 items-center bg-gray-50 px-3 rounded-lg border border-gray-300">
            {(['g', 'i', 'm'] as const).map((flag) => (
              <label key={flag} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-mono">{flag}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          g: 全局匹配 | i: 忽略大小写 | m: 多行模式
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">测试文本</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="请输入要测试的文本..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        onClick={handleTest}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" />
        测试匹配
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {matches !== null && (
        <div className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-900 mb-2">
              匹配结果：找到 {matches.length} 个匹配项
            </div>
            {matches.length > 0 && (
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <div key={index} className="bg-white rounded px-3 py-2 font-mono text-sm">
                    {index + 1}. {match}
                  </div>
                ))}
              </div>
            )}
          </div>

          {matches.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">高亮显示</label>
              <div
                className="p-4 bg-gray-50 border border-gray-300 rounded-lg whitespace-pre-wrap break-all"
                dangerouslySetInnerHTML={{ __html: highlightMatches() }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
