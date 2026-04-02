import {
  Hash,
  Code,
  FileText,
  Clock,
  Zap,
  Image,
  Key,
  Type,
  type LucideIcon,
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryName: string;
  categoryIcon: LucideIcon;
  categoryColor: string;
  icon: LucideIcon;
  keywords: string[];
  component: string;
}

export const tools: Tool[] = [
  // 加密解密
  {
    id: 'md5',
    name: 'MD5 加密',
    description: 'MD5 哈希算法加密',
    category: 'crypto',
    categoryName: '加密解密',
    categoryIcon: Key,
    categoryColor: 'text-purple-600',
    icon: Hash,
    keywords: ['md5', '加密', 'hash', '哈希'],
    component: 'MD5Tool'
  },
  {
    id: 'sha',
    name: 'SHA 加密',
    description: 'SHA-1/SHA-256/SHA-512 加密',
    category: 'crypto',
    categoryName: '加密解密',
    categoryIcon: Key,
    categoryColor: 'text-purple-600',
    icon: Hash,
    keywords: ['sha', 'sha1', 'sha256', 'sha512', '加密', 'hash'],
    component: 'SHATool'
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: 'Base64 编码和解码',
    category: 'crypto',
    categoryName: '加密解密',
    categoryIcon: Key,
    categoryColor: 'text-purple-600',
    icon: Key,
    keywords: ['base64', '编码', '解码', 'encode', 'decode'],
    component: 'Base64Tool'
  },
  {
    id: 'aes',
    name: 'AES 加解密',
    description: 'AES 对称加密解密',
    category: 'crypto',
    categoryName: '加密解密',
    categoryIcon: Key,
    categoryColor: 'text-purple-600',
    icon: Key,
    keywords: ['aes', '加密', '解密', 'encrypt', 'decrypt'],
    component: 'AESTool'
  },
  {
    id: 'rsa',
    name: 'RSA 加解密',
    description: 'RSA 非对称加密解密',
    category: 'crypto',
    categoryName: '加密解密',
    categoryIcon: Key,
    categoryColor: 'text-purple-600',
    icon: Key,
    keywords: ['rsa', '加密', '解密', '非对称'],
    component: 'RSATool'
  },

  // 编码转换
  {
    id: 'url-encode',
    name: 'URL 编解码',
    description: 'URL 编码和解码',
    category: 'encode',
    categoryName: '编码转换',
    categoryIcon: Type,
    categoryColor: 'text-green-600',
    icon: Type,
    keywords: ['url', 'encode', 'decode', '编码', '解码'],
    component: 'URLEncodeTool'
  },
  {
    id: 'unicode',
    name: 'Unicode 编解码',
    description: 'Unicode 编码转换',
    category: 'encode',
    categoryName: '编码转换',
    categoryIcon: Type,
    categoryColor: 'text-green-600',
    icon: Type,
    keywords: ['unicode', '编码', 'u4e00'],
    component: 'UnicodeTool'
  },
  {
    id: 'utf8',
    name: 'UTF-8 编解码',
    description: 'UTF-8 编码转换',
    category: 'encode',
    categoryName: '编码转换',
    categoryIcon: Type,
    categoryColor: 'text-green-600',
    icon: Type,
    keywords: ['utf8', 'utf-8', '编码'],
    component: 'UTF8Tool'
  },
  {
    id: 'ascii',
    name: 'ASCII 转换',
    description: 'ASCII 与字符互转',
    category: 'encode',
    categoryName: '编码转换',
    categoryIcon: Type,
    categoryColor: 'text-green-600',
    icon: Type,
    keywords: ['ascii', '转换', 'ascii码'],
    component: 'ASCIITool'
  },
  {
    id: 'hex',
    name: '十六进制转换',
    description: '十六进制与文本互转',
    category: 'encode',
    categoryName: '编码转换',
    categoryIcon: Type,
    categoryColor: 'text-green-600',
    icon: Type,
    keywords: ['hex', '十六进制', '16进制', 'hexadecimal'],
    component: 'HexTool'
  },

  // 代码格式化
  {
    id: 'json-format',
    name: 'JSON 格式化',
    description: 'JSON 格式化和压缩',
    category: 'format',
    categoryName: '代码格式化',
    categoryIcon: Code,
    categoryColor: 'text-blue-600',
    icon: Code,
    keywords: ['json', '格式化', 'format', '压缩'],
    component: 'JSONFormatTool'
  },
  {
    id: 'js-format',
    name: 'JavaScript 格式化',
    description: 'JS 代码格式化和美化',
    category: 'format',
    categoryName: '代码格式化',
    categoryIcon: Code,
    categoryColor: 'text-blue-600',
    icon: Code,
    keywords: ['javascript', 'js', '格式化', 'format', '美化'],
    component: 'JSFormatTool'
  },
  {
    id: 'html-format',
    name: 'HTML 格式化',
    description: 'HTML 代码格式化',
    category: 'format',
    categoryName: '代码格式化',
    categoryIcon: Code,
    categoryColor: 'text-blue-600',
    icon: Code,
    keywords: ['html', '格式化', 'format'],
    component: 'HTMLFormatTool'
  },
  {
    id: 'css-format',
    name: 'CSS 格式化',
    description: 'CSS 代码格式化和压缩',
    category: 'format',
    categoryName: '代码格式化',
    categoryIcon: Code,
    categoryColor: 'text-blue-600',
    icon: Code,
    keywords: ['css', '格式化', 'format', '压缩'],
    component: 'CSSFormatTool'
  },
  {
    id: 'xml-format',
    name: 'XML 格式化',
    description: 'XML 代码格式化',
    category: 'format',
    categoryName: '代码格式化',
    categoryIcon: Code,
    categoryColor: 'text-blue-600',
    icon: Code,
    keywords: ['xml', '格式化', 'format'],
    component: 'XMLFormatTool'
  },
  {
    id: 'sql-format',
    name: 'SQL 格式化',
    description: 'SQL 语句格式化',
    category: 'format',
    categoryName: '代码格式化',
    categoryIcon: Code,
    categoryColor: 'text-blue-600',
    icon: Code,
    keywords: ['sql', '格式化', 'format', '数据库'],
    component: 'SQLFormatTool'
  },

  // 代码处理
  {
    id: 'js-obfuscate',
    name: 'JS 代码混淆',
    description: 'JavaScript 代码混淆',
    category: 'code',
    categoryName: '代码处理',
    categoryIcon: Zap,
    categoryColor: 'text-orange-600',
    icon: Code,
    keywords: ['javascript', 'js', '混淆', 'obfuscate'],
    component: 'JSObfuscateTool'
  },
  {
    id: 'js-compress',
    name: 'JS 代码压缩',
    description: 'JavaScript 代码压缩',
    category: 'code',
    categoryName: '代码处理',
    categoryIcon: Zap,
    categoryColor: 'text-orange-600',
    icon: Code,
    keywords: ['javascript', 'js', '压缩', 'compress', 'minify'],
    component: 'JSCompressTool'
  },
  {
    id: 'escape',
    name: 'Escape 转义',
    description: 'Escape 编码和解码',
    category: 'code',
    categoryName: '代码处理',
    categoryIcon: Zap,
    categoryColor: 'text-orange-600',
    icon: Code,
    keywords: ['escape', 'unescape', '转义'],
    component: 'EscapeTool'
  },
  {
    id: 'html-js',
    name: 'HTML/JS 互转',
    description: 'HTML 与 JavaScript 互相转换',
    category: 'code',
    categoryName: '代码处理',
    categoryIcon: Zap,
    categoryColor: 'text-orange-600',
    icon: Code,
    keywords: ['html', 'javascript', '转换', 'convert'],
    component: 'HTMLJSTool'
  },
  {
    id: 'html-entity',
    name: 'HTML 实体转换',
    description: 'HTML 特殊字符实体转换',
    category: 'code',
    categoryName: '代码处理',
    categoryIcon: Zap,
    categoryColor: 'text-orange-600',
    icon: Code,
    keywords: ['html', 'entity', '实体', '特殊字符'],
    component: 'HTMLEntityTool'
  },

  // 文本处理
  {
    id: 'char-count',
    name: '字符统计',
    description: '统计字符、单词、行数',
    category: 'text',
    categoryName: '文本处理',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    icon: FileText,
    keywords: ['字符', '统计', 'count', '单词', '行数'],
    component: 'CharCountTool'
  },
  {
    id: 'text-diff',
    name: '文本对比',
    description: '对比两段文本的差异',
    category: 'text',
    categoryName: '文本处理',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    icon: FileText,
    keywords: ['文本', '对比', 'diff', '比较'],
    component: 'TextDiffTool'
  },
  {
    id: 'case-convert',
    name: '大小写转换',
    description: '文本大小写转换',
    category: 'text',
    categoryName: '文本处理',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    icon: Type,
    keywords: ['大小写', 'uppercase', 'lowercase', 'camelcase'],
    component: 'CaseConvertTool'
  },
  {
    id: 'chinese-convert',
    name: '简繁转换',
    description: '简体中文和繁体中文互转',
    category: 'text',
    categoryName: '文本处理',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    icon: Type,
    keywords: ['简体', '繁体', '中文', '转换'],
    component: 'ChineseConvertTool'
  },
  {
    id: 'remove-duplicate',
    name: '去重排序',
    description: '文本行去重和排序',
    category: 'text',
    categoryName: '文本处理',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    icon: FileText,
    keywords: ['去重', '排序', 'unique', 'sort'],
    component: 'RemoveDuplicateTool'
  },

  // 时间工具
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: '时间戳与日期时间互转',
    category: 'time',
    categoryName: '时间工具',
    categoryIcon: Clock,
    categoryColor: 'text-teal-600',
    icon: Clock,
    keywords: ['时间戳', 'timestamp', 'unix', '日期', '时间'],
    component: 'TimestampTool'
  },
  {
    id: 'date-calc',
    name: '日期计算',
    description: '日期间隔和日期加减',
    category: 'time',
    categoryName: '时间工具',
    categoryIcon: Clock,
    categoryColor: 'text-teal-600',
    icon: Clock,
    keywords: ['日期', '计算', 'date', '间隔'],
    component: 'DateCalcTool'
  },
  {
    id: 'cron',
    name: 'Cron 表达式',
    description: 'Cron 表达式生成和解析',
    category: 'time',
    categoryName: '时间工具',
    categoryIcon: Clock,
    categoryColor: 'text-teal-600',
    icon: Clock,
    keywords: ['cron', '定时任务', '表达式'],
    component: 'CronTool'
  },

  // 图像工具
  {
    id: 'qrcode',
    name: '二维码生成',
    description: '生成二维码图片',
    category: 'image',
    categoryName: '图像工具',
    categoryIcon: Image,
    categoryColor: 'text-pink-600',
    icon: Image,
    keywords: ['二维码', 'qrcode', 'qr', '生成'],
    component: 'QRCodeTool'
  },
  {
    id: 'barcode',
    name: '条形码生成',
    description: '生成条形码图片',
    category: 'image',
    categoryName: '图像工具',
    categoryIcon: Image,
    categoryColor: 'text-pink-600',
    icon: Image,
    keywords: ['条形码', 'barcode', '生成'],
    component: 'BarcodeTool'
  },
  {
    id: 'image-base64',
    name: '图片 Base64',
    description: '图片与 Base64 互转',
    category: 'image',
    categoryName: '图像工具',
    categoryIcon: Image,
    categoryColor: 'text-pink-600',
    icon: Image,
    keywords: ['图片', 'image', 'base64', '转换'],
    component: 'ImageBase64Tool'
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '颜色选择和格式转换',
    category: 'image',
    categoryName: '图像工具',
    categoryIcon: Image,
    categoryColor: 'text-pink-600',
    icon: Image,
    keywords: ['颜色', 'color', 'rgb', 'hex', 'hsl'],
    component: 'ColorPickerTool'
  },

  // 正则工具
  {
    id: 'regex-test',
    name: '正则测试',
    description: '正则表达式测试和匹配',
    category: 'regex',
    categoryName: '正则工具',
    categoryIcon: Zap,
    categoryColor: 'text-red-600',
    icon: Code,
    keywords: ['正则', 'regex', 'regexp', '表达式', '测试'],
    component: 'RegexTestTool'
  },
  {
    id: 'regex-generate',
    name: '正则生成',
    description: '常用正则表达式生成',
    category: 'regex',
    categoryName: '正则工具',
    categoryIcon: Zap,
    categoryColor: 'text-red-600',
    icon: Code,
    keywords: ['正则', 'regex', '生成', '表达式'],
    component: 'RegexGenerateTool'
  },
];

export interface ToolCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const allCategoryId = 'all';

export const categories: ToolCategory[] = Array.from(
  tools.reduce((categoryMap, tool) => {
    if (!categoryMap.has(tool.category)) {
      categoryMap.set(tool.category, {
        id: tool.category,
        name: tool.categoryName,
        icon: tool.categoryIcon,
        color: tool.categoryColor,
      });
    }

    return categoryMap;
  }, new Map<string, ToolCategory>()).values(),
);

export const toolMap = new Map(tools.map((tool) => [tool.id, tool]));

export function getToolPath(toolId: string) {
  return `/tools/${toolId}`;
}

export function findToolById(toolId?: string) {
  if (!toolId) {
    return undefined;
  }

  return toolMap.get(toolId);
}
