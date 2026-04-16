import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';
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

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={buttonClassName}
      aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
      title={isDark ? '切换到日间模式' : '切换到夜间模式'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? '日间模式' : '夜间模式'}</span>
    </button>
  );
}
