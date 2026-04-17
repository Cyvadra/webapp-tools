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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="classic-panel tool-content flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden">
        <div className="classic-header flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className="classic-icon-frame flex h-10 w-10 items-center justify-center">
              <Icon className="h-5 w-5 text-[var(--accent-foreground)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="classic-button classic-button-secondary flex h-10 w-10 items-center justify-center p-0"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {ToolComponent ? (
            <Suspense fallback={<div className="text-sm text-muted-foreground">正在加载工具...</div>}>
              <ToolComponent />
            </Suspense>
          ) : (
            <div className="text-sm text-muted-foreground">未找到对应工具组件。</div>
          )}
        </div>
      </div>
    </div>
  );
}
