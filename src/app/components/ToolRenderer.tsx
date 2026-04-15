import { Suspense, lazy, type ComponentType } from 'react';

interface ToolRendererProps {
  componentName: string;
}

const lazyTool = (
  loader: () => Promise<Record<string, ComponentType>>,
  exportName: string,
) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const toolComponents: Record<string, ComponentType> = {
  MD5Tool: lazyTool(() => import('./tools/MD5Tool'), 'MD5Tool'),
  SHATool: lazyTool(() => import('./tools/SHATool'), 'SHATool'),
  Base64Tool: lazyTool(() => import('./tools/Base64Tool'), 'Base64Tool'),
  AESTool: lazyTool(() => import('./tools/AESTool'), 'AESTool'),
  AESCrackTool: lazyTool(() => import('./tools/AESCrackTool'), 'AESCrackTool'),
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
  PasswordGeneratorTool: lazyTool(() => import('./tools/PasswordGeneratorTool'), 'PasswordGeneratorTool'),
};

export function ToolRenderer({ componentName }: ToolRendererProps) {
  const ToolComponent = toolComponents[componentName];

  if (!ToolComponent) {
    return <div className="text-sm text-gray-500">未找到对应工具组件。</div>;
  }

  return (
    <Suspense fallback={<div className="text-sm text-gray-500">正在加载工具...</div>}>
      <ToolComponent />
    </Suspense>
  );
}