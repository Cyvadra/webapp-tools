import { useState, useEffect } from 'react';

export function CharCountTool() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    chars: 0,
    charsNoSpace: 0,
    words: 0,
    lines: 0,
    bytes: 0,
    chinese: 0,
    english: 0,
    numbers: 0,
    punctuation: 0,
  });

  useEffect(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const bytes = new Blob([text]).size;
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const english = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const punctuation = (text.match(/[,.!?;:'"()[\]{}。，！？；：""''（）【】《》、]/g) || []).length;

    setStats({
      chars,
      charsNoSpace,
      words,
      lines,
      bytes,
      chinese,
      english,
      numbers,
      punctuation,
    });
  }, [text]);

  const statItems = [
    { label: '总字符数', value: stats.chars, color: 'text-blue-600' },
    { label: '不含空格', value: stats.charsNoSpace, color: 'text-green-600' },
    { label: '单词数', value: stats.words, color: 'text-purple-600' },
    { label: '行数', value: stats.lines, color: 'text-orange-600' },
    { label: '字节数', value: stats.bytes, color: 'text-pink-600' },
    { label: '中文字符', value: stats.chinese, color: 'text-red-600' },
    { label: '英文字母', value: stats.english, color: 'text-indigo-600' },
    { label: '数字', value: stats.numbers, color: 'text-teal-600' },
    { label: '标点符号', value: stats.punctuation, color: 'text-gray-600' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入要统计的文本..."
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">{item.label}</div>
            <div className={`text-2xl font-semibold ${item.color}`}>{item.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
