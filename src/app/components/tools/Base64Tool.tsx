import { Base64 } from 'js-base64';
import { BidirectionalTextTool } from './BidirectionalTextTool';

export function Base64Tool() {
  return (
    <BidirectionalTextTool
      leftTitle="原始文本"
      rightTitle="Base64 字符串"
      leftPlaceholder="请输入要编码的文本..."
      rightPlaceholder="请输入要解码的 Base64 字符串..."
      leftToRightLabel="文本转 Base64"
      rightToLeftLabel="Base64 转文本"
      transformLeftToRight={(value) => Base64.encode(value)}
      transformRightToLeft={(value) => Base64.decode(value)}
      rightToLeftErrorText="解码失败，请检查输入是否为有效的 Base64 字符串"
    />
  );
}
