import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Copy, Check } from 'lucide-react';

export function SHATool() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'SHA1' | 'SHA256' | 'SHA512'>('SHA256');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncrypt = () => {
    if (!input) return;
    let hash = '';
    switch (algorithm) {
      case 'SHA1':
        hash = CryptoJS.SHA1(input).toString();
        break;
      case 'SHA256':
        hash = CryptoJS.SHA256(input).toString();
        break;
      case 'SHA512':
        hash = CryptoJS.SHA512(input).toString();
        break;
    }
    setOutput(hash);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择算法</label>
        <div className="flex gap-2">
          {(['SHA1', 'SHA256', 'SHA512'] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                algorithm === algo
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入要加密的文本..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        onClick={handleEncrypt}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        加密
      </button>

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{algorithm} 加密结果</label>
          <div className="relative">
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm break-all">
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
    </div>
  );
}
