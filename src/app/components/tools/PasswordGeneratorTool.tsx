import { useState } from 'react';
import { Copy, Check, RefreshCw, ClipboardList } from 'lucide-react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SEPARATORS = '-_';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/** 2^32 — used to normalize a Uint32 value to the [0, 1) range */
const UINT32_RANGE = 0x100000000;

/**
 * Returns a cryptographically secure random integer in [0, max).
 * Uses rejection sampling to avoid modulo bias.
 */
function randomIndex(max: number): number {
  const limit = Math.floor(UINT32_RANGE / max) * max;
  const arr = new Uint32Array(1);
  let val: number;
  do {
    crypto.getRandomValues(arr);
    val = arr[0];
  } while (val >= limit);
  return val % max;
}

function generatePassword(
  length: number,
  useLower: boolean,
  useUpper: boolean,
  useNumbers: boolean,
  useSeparators: boolean,
  useSpecial: boolean,
): string {
  let charset = '';
  const requiredChars: string[] = [];

  if (useLower) {
    charset += LOWERCASE;
    requiredChars.push(LOWERCASE[randomIndex(LOWERCASE.length)]);
  }
  if (useUpper) {
    charset += UPPERCASE;
    requiredChars.push(UPPERCASE[randomIndex(UPPERCASE.length)]);
  }
  if (useNumbers) {
    charset += NUMBERS;
    requiredChars.push(NUMBERS[randomIndex(NUMBERS.length)]);
  }
  if (useSeparators) {
    charset += SEPARATORS;
    requiredChars.push(SEPARATORS[randomIndex(SEPARATORS.length)]);
  }
  if (useSpecial) {
    charset += SPECIAL;
    requiredChars.push(SPECIAL[randomIndex(SPECIAL.length)]);
  }

  if (!charset) return '';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  const passwordChars = Array.from(array, (val) => charset[val % charset.length]);

  // Scatter required chars across random positions to ensure each chosen type appears.
  // Use a separate array of fresh random values to avoid reusing entropy from `array`.
  const shuffleArray = new Uint32Array(requiredChars.length);
  crypto.getRandomValues(shuffleArray);
  for (let i = 0; i < requiredChars.length && i < length; i++) {
    const swapIdx = i + Math.floor((shuffleArray[i] / UINT32_RANGE) * (length - i));
    passwordChars[swapIdx] = requiredChars[i];
  }

  return passwordChars.join('');
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSeparators, setUseSeparators] = useState(false);
  const [useSpecial, setUseSpecial] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const noneSelected = !useLower && !useUpper && !useNumbers && !useSeparators && !useSpecial;

  const handleGenerate = () => {
    if (noneSelected) return;
    const generated = Array.from({ length: count }, () =>
      generatePassword(length, useLower, useUpper, useNumbers, useSeparators, useSpecial),
    );
    setPasswords(generated);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const handleCopyOne = (index: number) => {
    navigator.clipboard.writeText(passwords[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(passwords.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const checkboxClass = (active: boolean) =>
    `flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg border transition-colors ${
      active
        ? 'bg-blue-50 border-blue-400 text-blue-700'
        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="space-y-6">
      {/* Length */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          密码长度：<span className="text-blue-600 font-semibold">{length}</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <input
            type="number"
            min={4}
            max={64}
            value={length}
            onChange={(e) => {
              const v = Math.min(64, Math.max(4, Number(e.target.value)));
              setLength(v);
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          生成数量：<span className="text-blue-600 font-semibold">{count}</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => {
              const v = Math.min(20, Math.max(1, Number(e.target.value)));
              setCount(v);
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Character set options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">字符集</label>
        <div className="flex flex-wrap gap-2">
          <label className={checkboxClass(useLower)}>
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="accent-blue-500"
            />
            小写字母 (a–z)
          </label>
          <label className={checkboxClass(useUpper)}>
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="accent-blue-500"
            />
            大写字母 (A–Z)
          </label>
          <label className={checkboxClass(useNumbers)}>
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="accent-blue-500"
            />
            数字 (0–9)
          </label>
          <label className={checkboxClass(useSeparators)}>
            <input
              type="checkbox"
              checked={useSeparators}
              onChange={(e) => setUseSeparators(e.target.checked)}
              className="accent-blue-500"
            />
            连字符/下划线 (- _)
          </label>
          <label className={checkboxClass(useSpecial)}>
            <input
              type="checkbox"
              checked={useSpecial}
              onChange={(e) => setUseSpecial(e.target.checked)}
              className="accent-blue-500"
            />
            特殊字符 (!@#…)
          </label>
        </div>
        {noneSelected && (
          <p className="mt-2 text-sm text-red-500">请至少选择一种字符集</p>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={noneSelected}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        生成密码
      </button>

      {/* Results */}
      {passwords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              生成结果（共 {passwords.length} 个）
            </label>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-600"
            >
              {copiedAll ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <ClipboardList className="w-3.5 h-3.5" />
              )}
              {copiedAll ? '已复制' : '全部复制'}
            </button>
          </div>
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <span className="flex-1 font-mono text-sm break-all text-gray-900">{pw}</span>
                <button
                  onClick={() => handleCopyOne(i)}
                  className="shrink-0 p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  title="复制"
                >
                  {copiedIndex === i ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
