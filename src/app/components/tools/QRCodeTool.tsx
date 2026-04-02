import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

export function QRCodeTool() {
  const [input, setInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!input) return;
    try {
      const url = await QRCode.toDataURL(input, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, input, {
          width: size,
          margin: 2,
        });
      }
    } catch (error) {
      console.error('生成二维码失败', error);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeUrl;
    link.click();
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">输入内容</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入要生成二维码的内容（如：URL、文本等）"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            尺寸：{size} x {size} px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="64"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>128px</span>
            <span>512px</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          生成二维码
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        {qrCodeUrl ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <canvas ref={canvasRef} className="block" />
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载二维码
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p>输入内容后点击生成</p>
          </div>
        )}
      </div>
    </div>
  );
}
