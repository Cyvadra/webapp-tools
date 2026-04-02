import { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export function ImageBase64Tool() {
  const [base64, setBase64] = useState('');
  const [mode, setMode] = useState<'toBase64' | 'fromBase64'>('toBase64');
  const [imagePreview, setImagePreview] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64ToImage = () => {
    try {
      if (base64.startsWith('data:image')) {
        setImagePreview(base64);
      } else {
        setImagePreview(`data:image/png;base64,${base64}`);
      }
    } catch (error) {
      console.error('转换失败');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择模式</label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('toBase64');
              setBase64('');
              setImagePreview('');
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'toBase64'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            图片转 Base64
          </button>
          <button
            onClick={() => {
              setMode('fromBase64');
              setBase64('');
              setImagePreview('');
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'fromBase64'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Base64 转图片
          </button>
        </div>
      </div>

      {mode === 'toBase64' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">点击或拖拽图片到这里上传</p>
              <p className="text-sm text-gray-400 mt-1">支持 JPG、PNG、GIF 等格式</p>
            </label>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">输入 Base64 字符串</label>
          <textarea
            value={base64}
            onChange={(e) => setBase64(e.target.value)}
            placeholder="请输入 Base64 字符串..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
          <button
            onClick={handleBase64ToImage}
            className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            预览图片
          </button>
        </div>
      )}

      {imagePreview && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">图片预览</label>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded" />
          </div>
        </div>
      )}

      {base64 && mode === 'toBase64' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base64 字符串</label>
          <textarea
            value={base64}
            readOnly
            className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs overflow-auto"
          />
          <button
            onClick={() => navigator.clipboard.writeText(base64)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            复制 Base64
          </button>
        </div>
      )}
    </div>
  );
}
