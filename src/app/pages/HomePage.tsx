import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CompositionEvent } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { ToolCard } from '../components/ToolCard';
import { allCategoryId, categories, getToolPath, tools, type Tool } from '../data/tools';

function matchesToolSearch(tool: Tool, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  return (
    tool.name.toLowerCase().includes(normalizedQuery) ||
    tool.description.toLowerCase().includes(normalizedQuery) ||
    tool.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))
  );
}

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

    if (event.nativeEvent.isComposing || isComposingRef.current) {
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_52%,_#f6f7fb_100%)]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                全局搜索 + 独立工具页
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">开发者工具箱</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  搜索始终覆盖所有分类；点击任意工具会进入独立页面，方便分享、收藏、开多个标签同时操作。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span className="font-semibold text-slate-900">{tools.length}</span>
              个工具
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="全局搜索工具，例如：简繁、JSON、Base64、时间戳"
                value={draftQuery}
                onChange={updateSearch}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
              {draftQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="清除搜索"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
              {isSearching ? `已在全部分类中找到 ${totalCount} 个结果` : '未搜索时可按分类浏览'}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => updateCategory(allCategoryId)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedCategory === allCategoryId
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              全部
            </button>
            {categories.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => updateCategory(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  selectedCategory === id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
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
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">没有匹配结果</h2>
            <p className="mt-2 text-sm text-slate-500">试试更短的关键词，或者切换回全部分类继续浏览。</p>
          </section>
        ) : (
          groupedTools.map(({ category, tools: categoryTools }) => (
            <section key={category.id} className="mb-12 last:mb-0">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
                  <p className="text-sm text-slate-500">{categoryTools.length} 个工具</p>
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