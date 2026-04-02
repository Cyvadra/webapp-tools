import { BidirectionalTextTool } from './BidirectionalTextTool';

export function ASCIITool() {
  return (
    <BidirectionalTextTool
      leftTitle="字符文本"
      rightTitle="ASCII 码（空格分隔）"
      leftPlaceholder="请输入字符..."
      rightPlaceholder="请输入 ASCII 码，例如：72 101 108 108 111"
      leftToRightLabel="字符转 ASCII"
      rightToLeftLabel="ASCII 转字符"
      transformLeftToRight={(value) =>
        value
          .split('')
          .map((char) => char.charCodeAt(0))
          .join(' ')
      }
      transformRightToLeft={(value) =>
        value
          .trim()
          .split(/\s+/)
          .map((code) => String.fromCharCode(parseInt(code, 10)))
          .join('')
      }
    />
  );
}
