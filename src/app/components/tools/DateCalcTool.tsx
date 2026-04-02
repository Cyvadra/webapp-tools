import { useState } from 'react';
import { addDays, addHours, addMinutes, addMonths, addWeeks, addYears, format } from 'date-fns';

type OffsetUnit = 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

function toLocalInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function parseLocalDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function applyOffset(date: Date, amount: number, unit: OffsetUnit) {
  switch (unit) {
    case 'minutes':
      return addMinutes(date, amount);
    case 'hours':
      return addHours(date, amount);
    case 'days':
      return addDays(date, amount);
    case 'weeks':
      return addWeeks(date, amount);
    case 'months':
      return addMonths(date, amount);
    case 'years':
      return addYears(date, amount);
  }
}

export function DateCalcTool() {
  const now = new Date();
  const [startDate, setStartDate] = useState(toLocalInputValue(now));
  const [endDate, setEndDate] = useState(toLocalInputValue(addDays(now, 7)));
  const [baseDate, setBaseDate] = useState(toLocalInputValue(now));
  const [direction, setDirection] = useState<'add' | 'subtract'>('add');
  const [amount, setAmount] = useState('7');
  const [unit, setUnit] = useState<OffsetUnit>('days');
  const [differenceError, setDifferenceError] = useState('');
  const [offsetError, setOffsetError] = useState('');
  const [differenceResult, setDifferenceResult] = useState<null | {
    label: string;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>(null);
  const [offsetResult, setOffsetResult] = useState<null | {
    iso: string;
    weekday: string;
    timestamp: number;
  }>(null);

  const handleCalculateDifference = () => {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    if (!start || !end) {
      setDifferenceError('请输入有效的开始和结束时间');
      setDifferenceResult(null);
      return;
    }

    const deltaMilliseconds = end.getTime() - start.getTime();
    const absSeconds = Math.floor(Math.abs(deltaMilliseconds) / 1000);
    const days = Math.floor(absSeconds / 86400);
    const hours = Math.floor((absSeconds % 86400) / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const seconds = absSeconds % 60;

    setDifferenceResult({
      label: deltaMilliseconds >= 0 ? '结束时间晚于开始时间' : '结束时间早于开始时间',
      totalDays: Number((deltaMilliseconds / 86400000).toFixed(2)),
      totalHours: Number((deltaMilliseconds / 3600000).toFixed(2)),
      totalMinutes: Number((deltaMilliseconds / 60000).toFixed(2)),
      days,
      hours,
      minutes,
      seconds,
    });
    setDifferenceError('');
  };

  const handleCalculateOffset = () => {
    const date = parseLocalDate(baseDate);
    const parsedAmount = Number(amount);

    if (!date || Number.isNaN(parsedAmount)) {
      setOffsetError('请输入有效的基准时间和偏移量');
      setOffsetResult(null);
      return;
    }

    const signedAmount = direction === 'add' ? parsedAmount : -parsedAmount;
    const result = applyOffset(date, signedAmount, unit);

    setOffsetResult({
      iso: format(result, 'yyyy-MM-dd HH:mm:ss'),
      weekday: format(result, 'EEEE'),
      timestamp: Math.floor(result.getTime() / 1000),
    });
    setOffsetError('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">日期差值</h3>
          <p className="text-sm text-gray-500 mt-1">计算两个时间点之间的精确间隔。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleCalculateDifference}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          计算时间差
        </button>

        {differenceError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {differenceError}
          </div>
        )}

        {differenceResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">结果说明</div>
              <div className="font-semibold text-gray-900">{differenceResult.label}</div>
              <div className="text-sm text-gray-600 mt-2">
                {differenceResult.days} 天 {differenceResult.hours} 小时 {differenceResult.minutes} 分 {differenceResult.seconds} 秒
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">总天数</div>
              <div className="text-2xl font-semibold text-blue-600">{differenceResult.totalDays}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">总小时数</div>
              <div className="text-2xl font-semibold text-blue-600">{differenceResult.totalHours}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">总分钟数</div>
              <div className="text-2xl font-semibold text-blue-600">{differenceResult.totalMinutes}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">日期偏移</h3>
          <p className="text-sm text-gray-500 mt-1">基于指定时间快速前后推算目标日期。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_auto_1fr_1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">基准时间</label>
            <input
              type="datetime-local"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">方向</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDirection('add')}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  direction === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                加上
              </button>
              <button
                onClick={() => setDirection('subtract')}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  direction === 'subtract' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                减去
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数值</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">单位</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as OffsetUnit)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minutes">分钟</option>
              <option value="hours">小时</option>
              <option value="days">天</option>
              <option value="weeks">周</option>
              <option value="months">月</option>
              <option value="years">年</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculateOffset}
          className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
        >
          计算目标日期
        </button>

        {offsetError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {offsetError}
          </div>
        )}

        {offsetResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">目标时间</div>
              <div className="font-semibold text-gray-900">{offsetResult.iso}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">星期</div>
              <div className="font-semibold text-gray-900">{offsetResult.weekday}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Unix 时间戳</div>
              <div className="font-semibold text-gray-900 font-mono">{offsetResult.timestamp}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
