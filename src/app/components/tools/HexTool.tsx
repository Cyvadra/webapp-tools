import { BidirectionalTextTool } from './BidirectionalTextTool';

export function HexTool() {
  return (
    <BidirectionalTextTool
      leftTitle="文本"
      rightTitle="十六进制"
      leftPlaceholder="请输入文本..."
      rightPlaceholder="请输入十六进制，例如：48656C6C6F"
      leftToRightLabel="文本转十六进制"
      rightToLeftLabel="十六进制转文本"
      transformLeftToRight={(value) =>
        Array.from(value)
          .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(' ')
          .toUpperCase()
      }
      transformRightToLeft={(value) => {
        const cleanHex = value.replace(/\s+/g, '');
        const chars = cleanHex.match(/.{1,2}/g);

        if (!chars) {
          throw new Error('转换失败，请检查输入');
        }

        return chars.map((hex) => String.fromCharCode(parseInt(hex, 16))).join('');
      }}
    />
  );
}
