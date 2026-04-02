import { BidirectionalTextTool } from './BidirectionalTextTool';

export function JSONFormatTool() {
  return (
    <BidirectionalTextTool
      leftTitle="原始 JSON"
      rightTitle="处理结果"
      leftPlaceholder={'请输入 JSON...\n例如: {"name": "test", "value": 123}'}
      rightPlaceholder="请输入右侧 JSON 以压缩回左侧..."
      leftToRightLabel="格式化 JSON"
      rightToLeftLabel="压缩 JSON"
      transformLeftToRight={(value) => JSON.stringify(JSON.parse(value), null, 2)}
      transformRightToLeft={(value) => JSON.stringify(JSON.parse(value))}
      leftToRightErrorText="JSON 格式错误，请检查输入"
      rightToLeftErrorText="JSON 格式错误，请检查输入"
      minHeightClassName="min-h-[340px]"
    />
  );
}
