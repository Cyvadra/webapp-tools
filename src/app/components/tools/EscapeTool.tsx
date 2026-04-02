import { BidirectionalTextTool } from './BidirectionalTextTool';

export function EscapeTool() {
  return (
    <BidirectionalTextTool
      leftTitle="原始文本"
      rightTitle="Escape 字符串"
      leftPlaceholder="请输入要转义的文本..."
      rightPlaceholder="请输入要还原的 Escape 字符串..."
      leftToRightLabel="文本转 Escape"
      rightToLeftLabel="Escape 转文本"
      transformLeftToRight={(value) => escape(value)}
      transformRightToLeft={(value) => unescape(value)}
      leftToRightErrorText="转换失败"
      rightToLeftErrorText="转换失败"
    />
  );
}
