import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonClassName = 'classic-button classic-button-secondary classic-theme-toggle px-4 py-2 text-sm';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={buttonClassName}
        aria-label="主题切换加载中"
        title="主题切换加载中"
        disabled
      >
        <Monitor className="h-4 w-4" />
        <span>加载主题</span>
      </button>
    );
  }

  const mode = theme ?? 'system';
  const nextMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
  const label = mode === 'system' ? '跟随系统' : mode === 'dark' ? '夜间模式' : '日间模式';
  const title = nextMode === 'system' ? '切换为跟随系统' : nextMode === 'dark' ? '切换到夜间模式' : '切换到日间模式';
  const Icon = mode === 'system' ? Monitor : mode === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextMode)}
      className={buttonClassName}
      aria-label={title}
      title={title}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
