import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" className="classic-button classic-button-secondary classic-theme-toggle" disabled>
        <Moon className="h-4 w-4" />
        <span>主题切换</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="classic-button classic-button-secondary classic-theme-toggle"
      aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
      title={isDark ? '切换到日间模式' : '切换到夜间模式'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? '日间模式' : '夜间模式'}</span>
    </button>
  );
}
