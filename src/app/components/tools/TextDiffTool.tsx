import { useState } from 'react';

type DiffLine = {
  type: 'equal' | 'delete' | 'insert';
  content: string;
  leftNumber: number | null;
  rightNumber: number | null;
};

function buildDiff(before: string, after: string) {
  const leftLines = before.split('\n');
  const rightLines = after.split('\n');
  const dp = Array.from({ length: leftLines.length + 1 }, () => Array(rightLines.length + 1).fill(0));

  for (let leftIndex = leftLines.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = rightLines.length - 1; rightIndex >= 0; rightIndex -= 1) {
      if (leftLines[leftIndex] === rightLines[rightIndex]) {
        dp[leftIndex][rightIndex] = dp[leftIndex + 1][rightIndex + 1] + 1;
      } else {
        dp[leftIndex][rightIndex] = Math.max(dp[leftIndex + 1][rightIndex], dp[leftIndex][rightIndex + 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  let leftNumber = 1;
  let rightNumber = 1;

  while (leftIndex < leftLines.length && rightIndex < rightLines.length) {
    if (leftLines[leftIndex] === rightLines[rightIndex]) {
      result.push({
        type: 'equal',
        content: leftLines[leftIndex],
        leftNumber,
        rightNumber,
      });
      leftIndex += 1;
      rightIndex += 1;
      leftNumber += 1;
      rightNumber += 1;
    } else if (dp[leftIndex + 1][rightIndex] >= dp[leftIndex][rightIndex + 1]) {
      result.push({
        type: 'delete',
        content: leftLines[leftIndex],
        leftNumber,
        rightNumber: null,
      });
      leftIndex += 1;
      leftNumber += 1;
    } else {
      result.push({
        type: 'insert',
        content: rightLines[rightIndex],
        leftNumber: null,
        rightNumber,
      });
      rightIndex += 1;
      rightNumber += 1;
    }
  }

  while (leftIndex < leftLines.length) {
    result.push({
      type: 'delete',
      content: leftLines[leftIndex],
      leftNumber,
      rightNumber: null,
    });
    leftIndex += 1;
    leftNumber += 1;
  }

  while (rightIndex < rightLines.length) {
    result.push({
      type: 'insert',
      content: rightLines[rightIndex],
      leftNumber: null,
      rightNumber,
    });
    rightIndex += 1;
    rightNumber += 1;
  }

  return result;
}

export function TextDiffTool() {
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);

  const handleCompare = () => {
    setDiffLines(buildDiff(before, after));
  };

  const summary = diffLines.reduce(
    (accumulator, currentLine) => {
      if (currentLine.type === 'insert') {
        accumulator.inserted += 1;
      }
      if (currentLine.type === 'delete') {
        accumulator.deleted += 1;
      }
      if (currentLine.type === 'equal') {
        accumulator.unchanged += 1;
      }
      return accumulator;
    },
    { inserted: 0, deleted: 0, unchanged: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-auto xl:h-[320px]">
        <div className="flex flex-col min-h-[220px] xl:min-h-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">原文本</label>
          <textarea
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            placeholder="请输入原始文本..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>
        <div className="flex flex-col min-h-[220px] xl:min-h-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">新文本</label>
          <textarea
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            placeholder="请输入对比文本..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        开始对比
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">新增行</div>
          <div className="text-2xl font-semibold text-green-900">{summary.inserted}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">删除行</div>
          <div className="text-2xl font-semibold text-red-900">{summary.deleted}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">未变化</div>
          <div className="text-2xl font-semibold text-gray-900">{summary.unchanged}</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
          对比结果
        </div>
        <div className="max-h-[420px] overflow-auto font-mono text-sm">
          {diffLines.length > 0 ? (
            diffLines.map((line, index) => {
              const backgroundClass =
                line.type === 'insert'
                  ? 'bg-green-50'
                  : line.type === 'delete'
                    ? 'bg-red-50'
                    : 'bg-white';

              return (
                <div
                  key={`${line.type}-${index}`}
                  className={`grid grid-cols-[64px_64px_1fr] gap-3 px-4 py-2 border-b border-gray-100 ${backgroundClass}`}
                >
                  <span className="text-gray-400 text-right">{line.leftNumber ?? ''}</span>
                  <span className="text-gray-400 text-right">{line.rightNumber ?? ''}</span>
                  <span className="whitespace-pre-wrap break-all text-gray-900">
                    {line.type === 'insert' ? '+ ' : line.type === 'delete' ? '- ' : '  '}
                    {line.content || ' '}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">对比结果将显示在这里...</div>
          )}
        </div>
      </div>
    </div>
  );
}
