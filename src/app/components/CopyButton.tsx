import { Check, Copy, X, type LucideIcon } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

type CopyTone = 'default' | 'inverse';

interface CopyButtonProps {
  /** Text that will be written to the clipboard. */
  value: string;
  /** Optional visible label. Omit for an icon-only button. */
  label?: string;
  /** Label shown after a successful copy. Defaults to `label`. */
  copiedLabel?: string;
  /** Label shown after a failed copy. Only used when `label` is provided. */
  errorLabel?: string;
  /** Accessible name / tooltip. */
  title?: string;
  className?: string;
  /** Size and extra classes for the icon. Defaults to `h-4 w-4`. */
  iconClassName?: string;
  /** Icon shown while idle. Defaults to the copy icon. */
  icon?: LucideIcon;
  /** `inverse` keeps the icon white for solid-colored buttons. */
  tone?: CopyTone;
  disabled?: boolean;
  resetDelay?: number;
}

export function CopyButton({
  value,
  label,
  copiedLabel,
  errorLabel = '复制失败',
  title,
  className,
  iconClassName = 'h-4 w-4',
  icon,
  tone = 'default',
  disabled = false,
  resetDelay,
}: CopyButtonProps) {
  const { status, error, copy } = useCopyToClipboard(resetDelay);
  const copied = status === 'copied';
  const failed = status === 'error';

  const Icon = failed ? X : copied ? Check : (icon ?? Copy);
  const iconColorClassName =
    tone === 'inverse'
      ? 'text-white'
      : failed
        ? 'text-red-500'
        : copied
          ? 'text-green-500'
          : 'text-gray-600';
  const visibleLabel = failed ? (label ? errorLabel : undefined) : copied ? (copiedLabel ?? label) : label;
  const accessibleLabel = failed ? (error ?? errorLabel) : copied ? '已复制' : (title ?? label ?? '复制');

  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      disabled={disabled}
      className={className}
      title={accessibleLabel}
      aria-label={accessibleLabel}
    >
      <Icon className={`${iconClassName} ${iconColorClassName}`} aria-hidden="true" />
      {visibleLabel ? <span>{visibleLabel}</span> : null}
      <span className="sr-only" aria-live="polite">
        {copied ? '已复制' : failed ? '复制失败' : ''}
      </span>
    </button>
  );
}
