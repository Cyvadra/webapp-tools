import { useState, useEffect } from 'react';
import { Copy, Check, Clock } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const timezoneOptions = [
  { value: 'Asia/Shanghai', label: 'UTC+08:00 北京时间' },
  { value: 'UTC', label: 'UTC+00:00 协调世界时' },
  { value: 'Asia/Tokyo', label: 'UTC+09:00 东京' },
  { value: 'Asia/Singapore', label: 'UTC+08:00 新加坡' },
  { value: 'Asia/Dubai', label: 'UTC+04:00 迪拜' },
  { value: 'Europe/London', label: 'UTC+00:00 伦敦' },
  { value: 'Europe/Paris', label: 'UTC+01:00 巴黎' },
  { value: 'America/New_York', label: 'UTC-05:00 纽约' },
  { value: 'America/Los_Angeles', label: 'UTC-08:00 洛杉矶' },
  { value: 'Australia/Sydney', label: 'UTC+10:00 悉尼' },
] as const;

const dateTimeFormatterOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

function formatDateInTimeZone(timestamp: number, timeZone: string) {
  return new Date(timestamp).toLocaleString('zh-CN', {
    ...dateTimeFormatterOptions,
    timeZone,
  });
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    ...dateTimeFormatterOptions,
    hourCycle: 'h23',
    timeZone,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  ) - date.getTime();
}

function parseDateTimeInputInTimeZone(input: string, timeZone: string) {
  const match = input.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (!match) {
    return Number.NaN;
  }

  const [, year, month, day, hour, minute, second = '00'] = match;
  const utcGuess = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  const firstOffset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  const adjustedTimestamp = utcGuess - firstOffset;
  const secondOffset = getTimeZoneOffsetMs(new Date(adjustedTimestamp), timeZone);

  return utcGuess - secondOffset;
}

export function TimestampTool() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeZone, setTimeZone] = useState<(typeof timezoneOptions)[number]['value']>('Asia/Shanghai');
  const [timestampResult, setTimestampResult] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimestampToDate = () => {
    if (!timestampInput) return;
    try {
      const ts = parseInt(timestampInput);
      if (Number.isNaN(ts)) {
        throw new Error('invalid timestamp');
      }
      const timestamp = ts.toString().length === 10 ? ts * 1000 : ts;
      const formatted = formatDateInTimeZone(timestamp, timeZone);
      setTimestampResult(formatted);
    } catch (error) {
      setTimestampResult('转换失败，请检查时间戳格式');
    }
  };

  const handleDateToTimestamp = () => {
    if (!dateInput) return;
    try {
      const parsedTimestamp = parseDateTimeInputInTimeZone(dateInput, timeZone);
      if (Number.isNaN(parsedTimestamp)) {
        throw new Error('invalid date');
      }
      const timestamp = Math.floor(parsedTimestamp / 1000);
      setDateResult(timestamp.toString());
    } catch (error) {
      setDateResult('转换失败，请检查日期格式');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const currentDate = formatDateInTimeZone(currentTimestamp * 1000, timeZone);
  const selectedTimezoneLabel =
    timezoneOptions.find((option) => option.value === timeZone)?.label ?? timeZone;

  return (
    <div className="space-y-6">
      {/* Current Time */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">当前时间</h3>
          </div>
          <div className="w-full md:w-72">
            <Select value={timeZone} onValueChange={(value) => setTimeZone(value as (typeof timezoneOptions)[number]['value'])}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="选择时区" />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Unix 时间戳（秒）</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-semibold text-blue-600">{currentTimestamp}</span>
              <button
                onClick={() => handleCopy(currentTimestamp.toString(), 'current')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {copied === 'current' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">{selectedTimezoneLabel}</div>
            <div className="text-xl font-semibold text-gray-900">{currentDate}</div>
          </div>
        </div>
      </div>

      {/* Timestamp to Date */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">时间戳转日期</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">输出时间将按照当前选择的时区显示。</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="输入时间戳（秒或毫秒）"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button
              onClick={handleTimestampToDate}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              转换
            </button>
          </div>
          {timestampResult && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <span className="font-mono text-gray-900">{timestampResult}</span>
              <button
                onClick={() => handleCopy(timestampResult, 'timestamp')}
                className="p-2 hover:bg-white rounded transition-colors"
              >
                {copied === 'timestamp' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date to Timestamp */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">日期转时间戳</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">输入框中的日期时间会按当前选择的时区解释后再转换。</p>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleDateToTimestamp}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              转换
            </button>
          </div>
          {dateResult && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <span className="font-mono text-gray-900">{dateResult}</span>
              <button
                onClick={() => handleCopy(dateResult, 'date')}
                className="p-2 hover:bg-white rounded transition-colors"
              >
                {copied === 'date' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
