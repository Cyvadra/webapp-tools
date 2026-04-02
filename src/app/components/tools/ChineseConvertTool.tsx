import { BidirectionalTextTool } from './BidirectionalTextTool';

export function ChineseConvertTool() {
  return (
    <BidirectionalTextTool
      leftTitle="简体中文"
      rightTitle="繁体中文"
      leftPlaceholder="请输入简体中文内容..."
      rightPlaceholder="请输入繁体中文内容..."
      leftToRightLabel="简体转繁体"
      rightToLeftLabel="繁体转简体"
      transformLeftToRight={async (value) => {
        const opencc = await import('opencc-js/cn2t');
        const converter = opencc.Converter({ from: 'cn', to: 'tw' });
        return converter(value);
      }}
      transformRightToLeft={async (value) => {
        const opencc = await import('opencc-js/t2cn');
        const converter = opencc.Converter({ from: 'tw', to: 'cn' });
        return converter(value);
      }}
      leftToRightErrorText="转换失败，请检查输入内容"
      rightToLeftErrorText="转换失败，请检查输入内容"
      mono={false}
    />
  );
}
