import { Suspense, lazy } from 'react';
import { X } from 'lucide-react';
import { Tool } from '../data/tools';

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

const lazyTool = (loader: () => Promise<Record<string, React.ComponentType>>, exportName: string) =>
  lazy(() => loader().then((module) => ({ default: module[exportName] })));

const toolComponents: Record<string, React.ComponentType> = {
  MD5Tool: lazyTool(() => import('./tools/MD5Tool'), 'MD5Tool'),
  SHATool: lazyTool(() => import('./tools/SHATool'), 'SHATool'),
  Base64Tool: lazyTool(() => import('./tools/Base64Tool'), 'Base64Tool'),
  AESTool: lazyTool(() => import('./tools/AESTool'), 'AESTool'),
  RSATool: lazyTool(() => import('./tools/RSATool'), 'RSATool'),
  URLEncodeTool: lazyTool(() => import('./tools/URLEncodeTool'), 'URLEncodeTool'),
  UnicodeTool: lazyTool(() => import('./tools/UnicodeTool'), 'UnicodeTool'),
  UTF8Tool: lazyTool(() => import('./tools/UTF8Tool'), 'UTF8Tool'),
  ASCIITool: lazyTool(() => import('./tools/ASCIITool'), 'ASCIITool'),
  HexTool: lazyTool(() => import('./tools/HexTool'), 'HexTool'),
  JSONFormatTool: lazyTool(() => import('./tools/JSONFormatTool'), 'JSONFormatTool'),
  JSFormatTool: lazyTool(() => import('./tools/JSFormatTool'), 'JSFormatTool'),
  HTMLFormatTool: lazyTool(() => import('./tools/HTMLFormatTool'), 'HTMLFormatTool'),
  CSSFormatTool: lazyTool(() => import('./tools/CSSFormatTool'), 'CSSFormatTool'),
  XMLFormatTool: lazyTool(() => import('./tools/XMLFormatTool'), 'XMLFormatTool'),
  SQLFormatTool: lazyTool(() => import('./tools/SQLFormatTool'), 'SQLFormatTool'),
  JSObfuscateTool: lazyTool(() => import('./tools/JSObfuscateTool'), 'JSObfuscateTool'),
  JSCompressTool: lazyTool(() => import('./tools/JSCompressTool'), 'JSCompressTool'),
  EscapeTool: lazyTool(() => import('./tools/EscapeTool'), 'EscapeTool'),
  HTMLJSTool: lazyTool(() => import('./tools/HTMLJSTool'), 'HTMLJSTool'),
  HTMLEntityTool: lazyTool(() => import('./tools/HTMLEntityTool'), 'HTMLEntityTool'),
  CharCountTool: lazyTool(() => import('./tools/CharCountTool'), 'CharCountTool'),
  TextDiffTool: lazyTool(() => import('./tools/TextDiffTool'), 'TextDiffTool'),
  CaseConvertTool: lazyTool(() => import('./tools/CaseConvertTool'), 'CaseConvertTool'),
  ChineseConvertTool: lazyTool(() => import('./tools/ChineseConvertTool'), 'ChineseConvertTool'),
  RemoveDuplicateTool: lazyTool(() => import('./tools/RemoveDuplicateTool'), 'RemoveDuplicateTool'),
  TimestampTool: lazyTool(() => import('./tools/TimestampTool'), 'TimestampTool'),
  DateCalcTool: lazyTool(() => import('./tools/DateCalcTool'), 'DateCalcTool'),
  CronTool: lazyTool(() => import('./tools/CronTool'), 'CronTool'),
  QRCodeTool: lazyTool(() => import('./tools/QRCodeTool'), 'QRCodeTool'),
  BarcodeTool: lazyTool(() => import('./tools/BarcodeTool'), 'BarcodeTool'),
  ImageBase64Tool: lazyTool(() => import('./tools/ImageBase64Tool'), 'ImageBase64Tool'),
  ColorPickerTool: lazyTool(() => import('./tools/ColorPickerTool'), 'ColorPickerTool'),
  RegexTestTool: lazyTool(() => import('./tools/RegexTestTool'), 'RegexTestTool'),
  RegexGenerateTool: lazyTool(() => import('./tools/RegexGenerateTool'), 'RegexGenerateTool'),
};

export function ToolModal({ tool, onClose }: ToolModalProps) {
  const ToolComponent = toolComponents[tool.component];
  const Icon = tool.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{tool.name}</h2>
              <p className="text-sm text-gray-500">{tool.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {ToolComponent ? (
            <Suspense fallback={<div className="text-sm text-gray-500">正在加载工具...</div>}>
              <ToolComponent />
            </Suspense>
          ) : (
            <div className="text-sm text-gray-500">未找到对应工具组件。</div>
          )}
        </div>
      </div>
    </div>
  );
}
