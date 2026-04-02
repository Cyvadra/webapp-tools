import { BidirectionalTextTool } from './BidirectionalTextTool';

export function URLEncodeTool() {
  return (
    <BidirectionalTextTool
      leftTitle="原始文本"
      rightTitle="URL 编码文本"
      leftPlaceholder="请输入要编码的文本..."
      rightPlaceholder="请输入要解码的 URL 编码文本..."
      leftToRightLabel="文本转 URL 编码"
      rightToLeftLabel="URL 编码转文本"
      transformLeftToRight={(value) => encodeURIComponent(value)}
      transformRightToLeft={(value) => decodeURIComponent(value)}
    />
  );
}
