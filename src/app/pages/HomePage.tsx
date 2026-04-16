import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CompositionEvent } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { ThemeToggle } from '../components/ThemeToggle';
import { ToolCard } from '../components/ToolCard';
import { allCategoryId, categories, getToolPath, tools, type Tool } from '../data/tools';
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

  const groupedTools = useMemo(() => {
    const toolGroups = new Map<string, Tool[]>();

    filteredTools.forEach((tool) => {
      if (!toolGroups.has(tool.category)) {
        toolGroups.set(tool.category, []);
      }

      toolGroups.get(tool.category)?.push(tool);
    });

    return categories
      .map((category) => ({
        category,
        tools: toolGroups.get(category.id) ?? [],
      }))
      .filter(({ tools: categoryTools }) => categoryTools.length > 0);
  }, [filteredTools]);

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
        <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="classic-badge inline-flex items-center gap-2 px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                全局搜索 + 独立工具页
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">开发者工具箱</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  搜索始终覆盖所有分类；点击任意工具会进入独立页面，方便分享、收藏、开多个标签同时操作。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start">
              <div className="classic-panel flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{tools.length}</span>
                个工具
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="示例：jianfan、zfcs、JSON、Base64、时间戳"
                value={draftQuery}
                onChange={updateSearch}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="classic-input w-full py-3 pl-12 pr-12 text-sm"
              />
              {draftQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="classic-button classic-button-secondary absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center p-0 text-muted-foreground"
                  aria-label="清除搜索"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="classic-note px-4 py-3 text-sm">
              {isSearching ? `已在全部分类中找到 ${totalCount} 个结果` : '支持关键词、拼音首字母和模糊搜索'}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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

      <main className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
        {groupedTools.length === 0 ? (
          <section className="classic-empty-state px-6 py-20 text-center">
            <div className="classic-icon-frame mx-auto flex h-16 w-16 items-center justify-center">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-foreground">没有匹配结果</h2>
            <p className="mt-2 text-sm text-muted-foreground">试试更短的关键词，或者切换回全部分类继续浏览。</p>
          </section>
        ) : (
          groupedTools.map(({ category, tools: categoryTools }) => (
            <section key={category.id} className="mb-12 last:mb-0">
              <div className="mb-5 flex items-center gap-3">
                <div className="classic-icon-frame flex h-11 w-11 items-center justify-center">
                  <category.icon className="h-5 w-5 text-[var(--accent-foreground)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">{categoryTools.length} 个工具</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} href={getToolPath(tool.id)} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
