import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Copy, Check, Lock, Unlock } from 'lucide-react';

export function AESTool() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input || !key) return;
    try {
      if (mode === 'encrypt') {
        const encrypted = CryptoJS.AES.encrypt(input, key).toString();
        setOutput(encrypted);
      } else {
        const decrypted = CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
          setOutput('解密失败，请检查密钥是否正确');
        } else {
          setOutput(decrypted);
        }
      }
    } catch (error) {
      setOutput('处理失败，请检查输入和密钥');
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
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              mode === 'encrypt'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            加密
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              mode === 'decrypt'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Unlock className="w-4 h-4" />
            解密
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">密钥</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="请输入密钥..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'encrypt' ? '原始文本' : '加密文本'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? '请输入要加密的文本...' : '请输入要解密的文本...'}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        onClick={handleProcess}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {mode === 'encrypt' ? '加密' : '解密'}
      </button>

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'encrypt' ? '加密结果' : '解密结果'}
          </label>
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
    </div>
  );
}
