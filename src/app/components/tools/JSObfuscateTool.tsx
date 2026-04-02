import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function JSObfuscateTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [controlFlowFlattening, setControlFlowFlattening] = useState(false);
  const [stringArray, setStringArray] = useState(true);
  const [compact, setCompact] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleObfuscate = async () => {
    if (!input.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const { obfuscate } = await import('javascript-obfuscator');
      const result = obfuscate(input, {
        compact,
        simplify: true,
        stringArray,
        stringArrayThreshold: stringArray ? 0.75 : 0,
        controlFlowFlattening,
        controlFlowFlatteningThreshold: controlFlowFlattening ? 0.75 : 0,
        identifierNamesGenerator: 'hexadecimal',
      });

      setOutput(result.getObfuscatedCode());
    } catch (error) {
      setOutput(error instanceof Error ? error.message : '混淆失败，请检查输入代码');
    } finally {
      setIsLoading(false);
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
          <label className="block text-sm font-medium text-gray-700">输入 JavaScript 代码</label>
          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
                className="rounded"
              />
              紧凑输出
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stringArray}
                onChange={(e) => setStringArray(e.target.checked)}
                className="rounded"
              />
              字符串数组化
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={controlFlowFlattening}
                onChange={(e) => setControlFlowFlattening(e.target.checked)}
                className="rounded"
              />
              控制流扁平化
            </label>
            <button
              onClick={handleObfuscate}
              disabled={isLoading}
              className="ml-auto px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLoading ? '混淆中...' : '开始混淆'}
            </button>
          </div>
          <div className="text-xs text-gray-500">
            控制流扁平化会显著增大输出体积，并降低运行性能。
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入 JavaScript 代码..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-col min-h-[280px] xl:min-h-0">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">混淆结果</label>
          {output && !output.includes('失败') && (
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
          {output || (isLoading ? '正在加载混淆引擎...' : '混淆后的代码将显示在这里...')}
        </div>
      </div>
    </div>
  );
}
