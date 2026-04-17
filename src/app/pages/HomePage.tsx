import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CompositionEvent } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { ThemeToggle } from '../components/ThemeToggle';
import { ToolCard } from '../components/ToolCard';
import { allCategoryId, categories, getToolPath, tools } from '../data/tools';
import { matchesToolSearch } from '../utils/toolSearch';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const selectedCategory = searchParams.get('category') ?? allCategoryId;
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const isComposingRef = useRef(false);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  useEffect(() => {
    if (!isComposingRef.current) {
      setDraftQuery(searchQuery);
    }
  }, [searchQuery]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = matchesToolSearch(tool, normalizedQuery);
      const matchesCategory =
        isSearching || selectedCategory === allCategoryId || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [isSearching, normalizedQuery, selectedCategory]);

  const totalCount = filteredTools.length;

  const syncSearchToUrl = (nextValue: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextValue.trim()) {
      nextParams.set('q', nextValue);
    } else {
      nextParams.delete('q');
    }

    setSearchParams(nextParams, { replace: true });
  };

  const updateSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setDraftQuery(nextValue);

    const nativeEvent = event.nativeEvent as InputEvent;

    if (nativeEvent.isComposing || isComposingRef.current) {
      return;
    }

    syncSearchToUrl(nextValue);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const nextValue = event.currentTarget.value;
    setDraftQuery(nextValue);
    syncSearchToUrl(nextValue);
  };

  const updateCategory = (categoryId: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (categoryId === allCategoryId) {
      nextParams.delete('category');
    } else {
      nextParams.set('category', categoryId);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const clearSearch = () => {
    setDraftQuery('');
    syncSearchToUrl('');
  };

  return (
    <div className="classic-shell">
      <header className="classic-header sticky top-0 z-40">
        <div className="classic-layout px-0 py-4 sm:py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="搜索工具"
                aria-label="搜索开发者工具，支持关键词和拼音首字母"
                value={draftQuery}
                onChange={updateSearch}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="classic-input w-full py-2.5 pl-11 pr-11 text-sm"
              />
              {draftQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="classic-button classic-button-secondary absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center p-0 text-muted-foreground"
                  aria-label="清除搜索"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="classic-panel px-3 py-2 text-xs text-muted-foreground sm:text-sm">
                {isSearching || selectedCategory !== allCategoryId ? `${totalCount} 个结果` : `${tools.length} 个工具`}
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => updateCategory(allCategoryId)}
              className={`classic-chip classic-button px-4 py-2 text-sm ${
                selectedCategory === allCategoryId ? 'classic-chip-active' : ''
              }`}
            >
              全部
            </button>
            {categories.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => updateCategory(id)}
                className={`classic-chip classic-button flex items-center gap-2 px-4 py-2 text-sm ${
                  selectedCategory === id ? 'classic-chip-active' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="classic-layout px-0 py-6 sm:py-8">
        {filteredTools.length === 0 ? (
          <section className="classic-empty-state px-6 py-20 text-center">
            <div className="classic-icon-frame mx-auto flex h-16 w-16 items-center justify-center">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-foreground">没有匹配结果</h2>
            <p className="mt-2 text-sm text-muted-foreground">试试更短的关键词，或者切换回全部分类继续浏览。</p>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} href={getToolPath(tool.id)} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
