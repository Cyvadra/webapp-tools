import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RegexPattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

const regexPatterns: RegexPattern[] = [
  {
    name: '邮箱',
    pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
    description: '匹配常见邮箱格式',
    example: 'example@email.com',
  },
  {
    name: '手机号（中国）',
    pattern: '^1[3-9]\\d{9}$',
    description: '匹配中国大陆手机号',
    example: '13812345678',
  },
  {
    name: '身份证号',
    pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]$',
    description: '匹配18位身份证号',
    example: '110101199001011234',
  },
  {
    name: 'URL',
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    description: '匹配 HTTP/HTTPS URL',
    example: 'https://www.example.com',
  },
  {
    name: 'IPv4 地址',
    pattern: '^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$',
    description: '匹配 IPv4 地址',
    example: '192.168.1.1',
  },
  {
    name: '日期 (YYYY-MM-DD)',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    description: '匹配 YYYY-MM-DD 格式日期',
    example: '2024-01-01',
  },
  {
    name: '时间 (HH:MM:SS)',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$',
    description: '匹配 24 小时制时间',
    example: '23:59:59',
  },
  {
    name: '中文字符',
    pattern: '^[\\u4e00-\\u9fa5]+$',
    description: '匹配纯中文字符',
    example: '中文测试',
  },
  {
    name: '用户名',
    pattern: '^[a-zA-Z0-9_-]{3,16}$',
    description: '3-16位字母数字下划线横线',
    example: 'user_name-123',
  },
  {
    name: '密码（强）',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description: '至少8位，包含大小写字母、数字和特殊字符',
    example: 'Pass@word123',
  },
  {
    name: '十六进制颜色',
    pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
    description: '匹配 HEX 颜色值',
    example: '#FF5733',
  },
  {
    name: '整数',
    pattern: '^-?\\d+$',
    description: '匹配整数（含负数）',
    example: '-123',
  },
  {
    name: '小数',
    pattern: '^-?\\d+\\.\\d+$',
    description: '匹配小数',
    example: '3.14159',
  },
  {
    name: '邮政编码（中国）',
    pattern: '^[1-9]\\d{5}$',
    description: '匹配中国邮政编码',
    example: '100000',
  },
];

export function RegexGenerateTool() {
  const [selectedPattern, setSelectedPattern] = useState<RegexPattern | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (pattern: string) => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">选择常用正则表达式</label>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
          {regexPatterns.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => setSelectedPattern(pattern)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedPattern?.name === pattern.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{pattern.name}</div>
              <div className="text-xs text-gray-500">{pattern.description}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedPattern && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{selectedPattern.name}</h3>
            <p className="text-sm text-gray-600">{selectedPattern.description}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">正则表达式</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white rounded-lg p-3 border border-gray-300 font-mono text-sm break-all">
                  {selectedPattern.pattern}
                </div>
                <button
                  onClick={() => handleCopy(selectedPattern.pattern)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  复制
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">示例</label>
              <div className="bg-white rounded-lg p-3 border border-gray-300 font-mono text-sm text-green-600">
                {selectedPattern.example}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">JavaScript 用法</label>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                <div>const regex = /{selectedPattern.pattern}/;</div>
                <div className="mt-1">const isValid = regex.test('{selectedPattern.example}');</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
