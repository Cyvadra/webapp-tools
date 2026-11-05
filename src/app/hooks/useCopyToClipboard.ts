import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '../utils/clipboard';

export type CopyStatus = 'idle' | 'copied' | 'error';

interface UseCopyToClipboardResult {
  status: CopyStatus;
  error: string | null;
  copy: (value: string) => Promise<boolean>;
  reset: () => void;
}

const DEFAULT_RESET_DELAY = 2000;

export function useCopyToClipboard(resetDelay = DEFAULT_RESET_DELAY): UseCopyToClipboardResult {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const scheduleReset = useCallback(() => {
    clearResetTimer();
    resetTimerRef.current = setTimeout(() => {
      resetTimerRef.current = null;
      setStatus('idle');
      setError(null);
    }, resetDelay);
  }, [clearResetTimer, resetDelay]);

  const reset = useCallback(() => {
    clearResetTimer();
    setStatus('idle');
    setError(null);
  }, [clearResetTimer]);

  useEffect(() => () => clearResetTimer(), [clearResetTimer]);

  const copy = useCallback(
    async (value: string) => {
      try {
        await copyText(value);
        setStatus('copied');
        setError(null);
        scheduleReset();
        return true;
      } catch (copyError) {
        setStatus('error');
        setError(copyError instanceof Error ? copyError.message : '复制失败');
        scheduleReset();
        return false;
      }
    },
    [scheduleReset],
  );

  return { status, error, copy, reset };
}
