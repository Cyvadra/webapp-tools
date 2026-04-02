import { useState } from 'react';
import cronstrue from 'cronstrue/i18n';

const presetExpressions = [
  { label: '每 5 分钟', value: '*/5 * * * *' },
  { label: '工作日 09:00', value: '0 9 * * 1-5' },
  { label: '每天 00:00', value: '0 0 * * *' },
  { label: '每周一 10:30', value: '30 10 * * 1' },
];

function describeCron(expression: string) {
  return cronstrue.toString(expression, {
    locale: 'zh_CN',
    verbose: true,
    use24HourTimeFormat: true,
    throwExceptionOnParseError: true,
  });
}

export function CronTool() {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('9');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('1-5');
  const [description, setDescription] = useState('每天 09:00，仅在星期一到星期五');
  const [error, setError] = useState('');

  const syncBuilderFromExpression = (value: string) => {
    const parts = value.trim().split(/\s+/);
    if (parts.length !== 5) {
      return;
    }

    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  };

  const handleDescribe = () => {
    try {
      const result = describeCron(expression.trim());
      setDescription(result);
      setError('');
      syncBuilderFromExpression(expression);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Cron 表达式解析失败');
      setDescription('');
    }
  };

  const handleBuild = () => {
    const nextExpression = [minute || '*', hour || '*', dayOfMonth || '*', month || '*', dayOfWeek || '*'].join(' ');
    setExpression(nextExpression);

    try {
      setDescription(describeCron(nextExpression));
      setError('');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Cron 表达式生成失败');
      setDescription('');
    }
  };

  const handleApplyPreset = (value: string) => {
    setExpression(value);
    syncBuilderFromExpression(value);

    try {
      setDescription(describeCron(value));
      setError('');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Cron 表达式解析失败');
      setDescription('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Cron 解析</h3>
          <p className="text-sm text-gray-500 mt-1">支持标准 5 段 Cron 表达式。</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {presetExpressions.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleApplyPreset(preset.value)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cron 表达式</label>
          <div className="flex flex-col lg:flex-row gap-3">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="例如：0 9 * * 1-5"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button
              onClick={handleDescribe}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              解析表达式
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {description && !error && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="text-sm text-emerald-700 mb-1">自然语言描述</div>
            <div className="font-semibold text-emerald-900">{description}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Cron 生成器</h3>
          <p className="text-sm text-gray-500 mt-1">按字段拼出常见定时规则。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分钟</label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">小时</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="9"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">日</label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              placeholder="*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">月</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">星期</label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              placeholder="1-5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          常用写法：`*` 表示任意，`*/5` 表示步长，`1-5` 表示范围，`1,3,5` 表示枚举。
        </div>

        <button
          onClick={handleBuild}
          className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
        >
          生成并解析
        </button>
      </div>
    </div>
  );
}
