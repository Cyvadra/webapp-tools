import { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '¥': '&yen;',
  '£': '&pound;',
  '¢': '&cent;',
  '§': '&sect;',
  '¶': '&para;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
};

export function HTMLEntityTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input) return;
    try {
      if (mode === 'encode') {
        let result = input;
        Object.entries(htmlEntities).forEach(([char, entity]) => {
          result = result.split(char).join(entity);
        });
        setOutput(result);
      } else {
        let result = input;
        Object.entries(htmlEntities).forEach(([char, entity]) => {
          result = result.split(entity).join(char);
        });
        result = result.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
        setOutput(result);
      }
    } catch (error) {
      setOutput('转换失败');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择模式</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'encode'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            转为实体
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'decode'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            转为字符
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? '请输入 HTML 字符...' : '请输入 HTML 实体...'}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
        />
      </div>

      <button
        onClick={handleConvert}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
      >
        转换
        <ArrowRight className="w-4 h-4" />
      </button>

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">结果</label>
          <div className="relative">
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm break-all max-h-64 overflow-y-auto">
              {output}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">常用 HTML 实体</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {Object.entries(htmlEntities).slice(0, 15).map(([char, entity]) => (
            <div key={entity} className="flex items-center gap-2">
              <span className="font-mono text-gray-600">{char}</span>
              <span className="text-gray-400">→</span>
              <span className="font-mono text-blue-600">{entity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
