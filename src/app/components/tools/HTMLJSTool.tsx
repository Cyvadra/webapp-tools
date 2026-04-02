import { BidirectionalTextTool } from './BidirectionalTextTool';

function parseSingleQuotedString(source: string) {
  let result = '';

  for (let index = 0; index < source.length; index += 1) {
    const currentChar = source[index];
    if (currentChar !== '\\') {
      result += currentChar;
      continue;
    }

    const nextChar = source[index + 1];
    index += 1;

    switch (nextChar) {
      case 'n':
        result += '\n';
        break;
      case 'r':
        result += '\r';
        break;
      case 't':
        result += '\t';
        break;
      case '\\':
        result += '\\';
        break;
      case "'":
        result += "'";
        break;
      default:
        result += nextChar;
        break;
    }
  }

  return result;
}

function htmlToJavaScript(html: string) {
  const escaped = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  return `const html = \`${escaped}\`;`;
}

function javaScriptToHtml(source: string) {
  const trimmed = source.trim().replace(/^(const|let|var)\s+[a-zA-Z_$][\w$]*\s*=\s*/, '').replace(/;$/, '').trim();

  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return trimmed.slice(1, -1).replace(/\\`/g, '`').replace(/\\\$\{/g, '${').replace(/\\\\/g, '\\');
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed);
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return parseSingleQuotedString(trimmed.slice(1, -1));
  }

  throw new Error('仅支持模板字符串、单双引号字符串，以及简单赋值语句');
}

export function HTMLJSTool() {
  return (
    <BidirectionalTextTool
      leftTitle="HTML"
      rightTitle="JavaScript 字符串"
      leftPlaceholder="请输入 HTML..."
      rightPlaceholder="请输入 JavaScript 字符串或简单赋值语句..."
      leftToRightLabel="HTML 转 JS"
      rightToLeftLabel="JS 转 HTML"
      transformLeftToRight={(value) => htmlToJavaScript(value)}
      transformRightToLeft={(value) => javaScriptToHtml(value)}
      helperText="JS 转 HTML 支持模板字符串、单双引号字符串，以及简单赋值语句。"
    />
  );
}
