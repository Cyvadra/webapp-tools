import { BidirectionalTextTool } from './BidirectionalTextTool';

export function UnicodeTool() {
  return (
    <BidirectionalTextTool
      leftTitle="原始文本"
      rightTitle="Unicode 编码"
      leftPlaceholder="请输入要编码的文本..."
      rightPlaceholder="请输入 Unicode 编码，例如：\\u4e2d\\u6587"
      leftToRightLabel="文本转 Unicode"
      rightToLeftLabel="Unicode 转文本"
      transformLeftToRight={(value) =>
        value
          .split('')
          .map((char) => {
            const code = char.charCodeAt(0);
            return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
          })
          .join('')
      }
      transformRightToLeft={(value) =>
        value.replace(/\\u[\dA-Fa-f]{4}/g, (match) =>
          String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)),
        )
      }
    />
  );
}
