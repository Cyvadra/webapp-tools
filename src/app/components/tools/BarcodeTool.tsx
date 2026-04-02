import { useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Download } from 'lucide-react';

const presets = {
  CODE128: 'CNZZ-2026-001',
  CODE39: 'HELLO-123',
  EAN13: '5901234123457',
  EAN8: '55123457',
  ITF: '12345678',
} as const;

export function BarcodeTool() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [value, setValue] = useState(presets.CODE128);
  const [format, setFormat] = useState<keyof typeof presets>('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    if (!svgRef.current || !value.trim()) {
      return;
    }

    let isValid = true;

    try {
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue: true,
        margin: 12,
        background: '#ffffff',
        lineColor: '#111827',
        valid: (valid) => {
          isValid = valid;
        },
      });

      if (!isValid) {
        throw new Error('当前内容不符合所选条形码格式要求');
      }

      setGenerated(true);
      setError('');
    } catch (currentError) {
      setGenerated(false);
      setError(currentError instanceof Error ? currentError.message : '条形码生成失败');
    }
  };

  const handleDownload = () => {
    if (!svgRef.current || !generated) {
      return;
    }

    const serializer = new XMLSerializer();
    const svgContent = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${format.toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">条形码格式</label>
          <select
            value={format}
            onChange={(e) => {
              const nextFormat = e.target.value as keyof typeof presets;
              setFormat(nextFormat);
              setValue(presets[nextFormat]);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(presets).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">编码内容</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">线宽</label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">{width}px</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">高度</label>
            <input
              type="range"
              min="40"
              max="140"
              step="10"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">{height}px</div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          生成条形码
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 min-h-[320px]">
        {generated ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-full overflow-auto">
              <svg ref={svgRef} className="max-w-full" />
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载 SVG
            </button>
          </>
        ) : (
          <>
            <svg ref={svgRef} className="hidden" />
            <div className="text-center text-gray-500">
              <div className="w-48 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                预览区域
              </div>
              <p>选择格式并输入内容后即可生成条形码</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
