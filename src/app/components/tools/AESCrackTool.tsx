import { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { Copy, Check, Search, X } from 'lucide-react';

// Common weak passwords / 常见弱口令列表
const WEAK_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567',
  '1234567890', 'qwerty', 'abc123', '111111', '123123', 'admin',
  'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
  'princess', 'shadow', 'superman', 'michael', 'football', 'iloveyou',
  '1q2w3e', '1q2w3e4r', '1qaz2wsx', 'passw0rd', 'pass1234', 'test',
  'test123', 'root', 'toor', 'admin123', 'administrator', 'guest',
  '000000', '654321', '666666', '888888', '999999', '112233',
  'qwerty123', 'qazwsx', 'zxcvbnm', 'asdfgh', 'asdfghjkl',
  'password1', 'password123', 'p@ssword', 'p@ssw0rd', 'Pa$$w0rd',
  '1234', '4321', '2580', '147258', '159753', '753951',
  'abc', 'abc1234', 'abcd1234', 'abcdef', '123abc', 'pass',
  'hello', 'hello123', 'welcome1', 'login', 'access',
  'secret', 'mypass', 'mypassword', 'changeme', 'changeme123',
  'qwer1234', 'asdf1234', '1234qwer', '1234asdf',
  'aaaaaa', 'bbbbbb', '121212', '696969', '777777',
  'baseball', 'batman', 'soccer', 'hockey', 'ranger',
  'daniel', 'george', 'jordan', 'harley', 'maverick',
  'thomas', 'andrew', 'robert', 'charlie', 'hunter',

  'china', 'chinese', 'beijing', 'shanghai', 'shenzhen',
  'alibaba', 'tencent', 'baidu', 'huawei',
  'admin@123', 'Admin123', 'Admin@123', 'root123', 'ROOT123',
  'P@ssword1', 'P@ssword123', 'Aa123456', 'Aa123456!',
  '!QAZ2wsx', 'Qwerty123', 'Abcd1234', '1234Abcd',
];

interface CrackResult {
  found: boolean;
  password?: string;
  decrypted?: string;
  tried: number;
  total: number;
}

export function AESCrackTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [result, setResult] = useState<CrackResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelledRef = useRef(false);

  const handleCrack = async () => {
    if (!input.trim()) return;

    cancelledRef.current = false;
    setStatus('running');
    setResult(null);
    setOutput('');
    setProgress(0);

    const total = WEAK_PASSWORDS.length;
    let found = false;

    for (let i = 0; i < total; i++) {
      if (cancelledRef.current) break;

      // Yield to the event loop every 10 attempts so the UI stays responsive
      if (i % 10 === 0) {
        setProgress(Math.round((i / total) * 100));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const pwd = WEAK_PASSWORDS[i];
      try {
        const decrypted = CryptoJS.AES.decrypt(input.trim(), pwd).toString(CryptoJS.enc.Utf8);
        // Reject empty strings and strings that contain UTF-8 replacement characters
        // (which indicate the key produced garbage bytes during decryption).
        if (decrypted && decrypted.length > 0 && !decrypted.includes('\uFFFD')) {
          setResult({ found: true, password: pwd, decrypted, tried: i + 1, total });
          setOutput(decrypted);
          found = true;
          break;
        }
      } catch {
        // wrong password — continue
      }
    }

    if (!found && !cancelledRef.current) {
      setResult({ found: false, tried: total, total });
    }

    setProgress(100);
    setStatus('done');
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    setStatus('done');
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        ⚠️ 本工具仅用于合法授权的安全测试与学习目的。使用前请确保您拥有对相关数据进行测试的合法授权。
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">AES 密文（CryptoJS 格式）</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入 AES 加密后的密文..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCrack}
          disabled={!input.trim() || status === 'running'}
          className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {status === 'running' ? `破解中… ${progress}%` : '开始破解'}
        </button>
        {status === 'running' && (
          <button
            onClick={handleCancel}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            取消
          </button>
        )}
      </div>

      {status === 'running' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {result && (
        <div
          className={`p-4 rounded-lg border ${
            result.found
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {result.found ? (
            <div className="space-y-1 text-sm text-green-800">
              <p className="font-semibold">✅ 破解成功！</p>
              <p>
                密钥：<span className="font-mono font-bold">{result.password}</span>
              </p>
              <p>
                已尝试 {result.tried} / {result.total} 个密码
              </p>
            </div>
          ) : (
            <div className="text-sm text-red-800">
              <p className="font-semibold">❌ 未能破解</p>
              <p>已尝试全部 {result.total} 个常见弱口令，均无法解密。密钥可能不在常见弱口令列表中。</p>
            </div>
          )}
        </div>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">解密结果</label>
          <div className="relative">
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm break-all max-h-64 overflow-y-auto">
              {output}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        内置 {WEAK_PASSWORDS.length} 个常见弱口令（仅支持 CryptoJS 默认 AES 加密格式）
      </div>
    </div>
  );
}
