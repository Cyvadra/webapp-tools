import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Eraser } from 'lucide-react';

type Transform = (value: string) => string | Promise<string>;

interface BidirectionalTextToolProps {
  leftTitle: string;
  rightTitle: string;
  leftPlaceholder: string;
  rightPlaceholder: string;
  leftToRightLabel: string;
  rightToLeftLabel: string;
  transformLeftToRight: Transform;
  transformRightToLeft: Transform;
  leftToRightErrorText?: string;
  rightToLeftErrorText?: string;
  helperText?: string;
  mono?: boolean;
  minHeightClassName?: string;
}

export function BidirectionalTextTool({
  leftTitle,
  rightTitle,
  leftPlaceholder,
  rightPlaceholder,
  leftToRightLabel,
  rightToLeftLabel,
  transformLeftToRight,
  transformRightToLeft,
  leftToRightErrorText = '处理失败，请检查输入',
  rightToLeftErrorText = '处理失败，请检查输入',
  helperText,
  mono = true,
  minHeightClassName = 'min-h-[320px]',
}: BidirectionalTextToolProps) {
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');
  const [copiedSide, setCopiedSide] = useState<'left' | 'right' | null>(null);
  const [pendingDirection, setPendingDirection] = useState<'ltr' | 'rtl' | null>(null);

  const textareaClassName = [
    'flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500',
    mono ? 'font-mono' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const resolveErrorText = (error: unknown, fallbackText: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallbackText;
  };

  const handleTransform = async (direction: 'ltr' | 'rtl') => {
    const sourceValue = direction === 'ltr' ? leftValue : rightValue;

    if (!sourceValue) {
      if (direction === 'ltr') {
        setRightValue('');
      } else {
        setLeftValue('');
      }
      return;
    }

    try {
      setPendingDirection(direction);
      const result =
        direction === 'ltr'
          ? await transformLeftToRight(sourceValue)
          : await transformRightToLeft(sourceValue);

      if (direction === 'ltr') {
        setRightValue(result);
      } else {
        setLeftValue(result);
      }
    } catch (error) {
      const fallbackText = direction === 'ltr' ? leftToRightErrorText : rightToLeftErrorText;
      const resolvedErrorText = resolveErrorText(error, fallbackText);

      if (direction === 'ltr') {
        setRightValue(resolvedErrorText);
      } else {
        setLeftValue(resolvedErrorText);
      }
    } finally {
      setPendingDirection(null);
    }
  };

  const handleCopy = (value: string, side: 'left' | 'right') => {
    navigator.clipboard.writeText(value);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  const leftCopied = copiedSide === 'left';
  const rightCopied = copiedSide === 'right';
  const actionButtonClassName =
    'flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400';

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_188px_minmax(0,1fr)] xl:items-stretch">
      <div className={`flex ${minHeightClassName} flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-700">{leftTitle}</label>
          <div className="flex items-center gap-2">
            {leftValue ? (
              <button
                type="button"
                onClick={() => handleCopy(leftValue, 'left')}
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-slate-50"
              >
                {leftCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-600" />}
                复制
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setLeftValue('')}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            >
              <Eraser className="h-3.5 w-3.5" />
              清空
            </button>
          </div>
        </div>

        {helperText ? <div className="mb-3 text-xs text-slate-500">{helperText}</div> : null}

        <textarea
          value={leftValue}
          onChange={(event) => setLeftValue(event.target.value)}
          placeholder={leftPlaceholder}
          className={textareaClassName}
        />
      </div>

      <div className="flex flex-col justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:gap-4">
        <button
          type="button"
          onClick={() => void handleTransform('ltr')}
          disabled={pendingDirection !== null}
          className={actionButtonClassName}
        >
          <span>{pendingDirection === 'ltr' ? '处理中...' : leftToRightLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void handleTransform('rtl')}
          disabled={pendingDirection !== null}
          className={actionButtonClassName}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{pendingDirection === 'rtl' ? '处理中...' : rightToLeftLabel}</span>
        </button>
      </div>

      <div className={`flex ${minHeightClassName} flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-700">{rightTitle}</label>
          <div className="flex items-center gap-2">
            {rightValue ? (
              <button
                type="button"
                onClick={() => handleCopy(rightValue, 'right')}
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-slate-50"
              >
                {rightCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-600" />}
                复制
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setRightValue('')}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            >
              <Eraser className="h-3.5 w-3.5" />
              清空
            </button>
          </div>
        </div>

        <textarea
          value={rightValue}
          onChange={(event) => setRightValue(event.target.value)}
          placeholder={rightPlaceholder}
          className={textareaClassName}
        />
      </div>
    </div>
  );
}