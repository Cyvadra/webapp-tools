const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const RAW_TEXT_ELEMENTS = new Set(['script', 'style', 'pre', 'textarea']);

interface TagToken {
  type: 'tag';
  value: string;
  name: string;
  closing: boolean;
  selfClosing: boolean;
}

interface TextToken {
  type: 'text' | 'raw';
  value: string;
}

interface LiteralToken {
  type: 'comment' | 'doctype';
  value: string;
}

type HtmlToken = TagToken | TextToken | LiteralToken;

function readTag(source: string, start: number) {
  let quote: string | null = null;
  let index = start + 1;

  while (index < source.length) {
    const character = source[index];

    if (quote) {
      if (character === quote) {
        quote = null;
      }
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return { end: index + 1, raw: source.slice(start, index + 1) };
    }

    index += 1;
  }

  return { end: source.length, raw: source.slice(start) };
}

function classifyTag(raw: string): HtmlToken {
  const value = raw.trim();

  if (/^<!doctype/i.test(value)) {
    return { type: 'doctype', value };
  }

  if (value.startsWith('<!--')) {
    return { type: 'comment', value };
  }

  const closing = value.startsWith('</');
  const name = value.match(/^<\/?\s*([a-zA-Z][\w:-]*)/)?.[1]?.toLowerCase() ?? '';

  return {
    type: 'tag',
    value,
    name,
    closing,
    selfClosing: /\/\s*>$/.test(value),
  };
}

function tokenizeHtml(source: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let index = 0;

  while (index < source.length) {
    const tagStart = source.indexOf('<', index);

    if (tagStart === -1) {
      tokens.push({ type: 'text', value: source.slice(index) });
      break;
    }

    if (tagStart > index) {
      tokens.push({ type: 'text', value: source.slice(index, tagStart) });
    }

    if (source.startsWith('<!--', tagStart)) {
      const commentEnd = source.indexOf('-->', tagStart + 4);
      const end = commentEnd === -1 ? source.length : commentEnd + 3;
      tokens.push({ type: 'comment', value: source.slice(tagStart, end) });
      index = end;
      continue;
    }

    const { end, raw } = readTag(source, tagStart);
    const token = classifyTag(raw);
    tokens.push(token);
    index = end;

    if (token.type === 'tag' && !token.closing && !token.selfClosing && RAW_TEXT_ELEMENTS.has(token.name)) {
      const closingTagPattern = new RegExp(`</\\s*${token.name}\\s*>`, 'i');
      const remaining = source.slice(index);
      const match = remaining.match(closingTagPattern);
      const contentEnd = match?.index === undefined ? source.length : index + match.index;

      if (contentEnd > index) {
        tokens.push({ type: 'raw', value: source.slice(index, contentEnd) });
      }

      index = contentEnd;
    }
  }

  return tokens;
}

export function formatHtml(source: string, indentSize = 2): string {
  const tokens = tokenizeHtml(source);
  const lines: string[] = [];
  const indent = (level: number) => ' '.repeat(Math.max(0, level) * indentSize);
  let depth = 0;

  const pushLine = (value: string, level = depth) => {
    lines.push(`${indent(level)}${value}`);
  };

  tokens.forEach((token) => {
    if (token.type === 'text') {
      const text = token.value.replace(/\s+/g, ' ').trim();

      if (text) {
        pushLine(text);
      }

      return;
    }

    if (token.type === 'raw') {
      const raw = token.value.replace(/^\s*\n/, '').replace(/\s*$/, '');

      if (raw) {
        lines.push(raw);
      }

      return;
    }

    if (token.type === 'comment' || token.type === 'doctype') {
      pushLine(token.value);
      return;
    }

    if (token.closing) {
      depth = Math.max(0, depth - 1);
      pushLine(token.value);
      return;
    }

    pushLine(token.value);

    if (!token.selfClosing && !VOID_ELEMENTS.has(token.name)) {
      depth += 1;
    }
  });

  return lines.join('\n');
}
