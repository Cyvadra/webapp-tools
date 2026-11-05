const COPY_ERROR_MESSAGE = '复制失败，请手动选择文本后复制';

function copyWithLegacyCommand(text: string): boolean {
  if (typeof document === 'undefined' || !document.body || typeof document.execCommand !== 'function') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const selection = document.getSelection();
  const savedRanges: Range[] = [];

  if (selection) {
    for (let index = 0; index < selection.rangeCount; index += 1) {
      savedRanges.push(selection.getRangeAt(index));
    }
  }

  document.body.appendChild(textarea);

  let succeeded = false;

  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    succeeded = document.execCommand('copy');
  } catch {
    succeeded = false;
  } finally {
    textarea.remove();

    if (selection) {
      selection.removeAllRanges();
      savedRanges.forEach((range) => selection.addRange(range));
    }

    activeElement?.focus({ preventScroll: true });
  }

  return succeeded;
}

/**
 * Copies text to the clipboard.
 *
 * `navigator.clipboard` is only available in secure contexts (HTTPS or
 * localhost), so the site must also work when it is served over plain HTTP.
 * In that case we fall back to the legacy `execCommand('copy')` path, which
 * still works in every major browser when invoked from a user gesture.
 */
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Permission denied or an unavailable clipboard API: try the fallback.
    }
  }

  if (!copyWithLegacyCommand(text)) {
    throw new Error(COPY_ERROR_MESSAGE);
  }
}
