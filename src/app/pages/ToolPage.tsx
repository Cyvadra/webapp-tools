import { useEffect, useMemo } from 'react';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { ThemeToggle } from '../components/ThemeToggle';
import { ToolCard } from '../components/ToolCard';
import { ToolRenderer } from '../components/ToolRenderer';
import { findToolById, getToolPath, tools } from '../data/tools';

function ensureMetaDescription() {
  let descriptionTag = document.querySelector('meta[name="description"]');

  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }

  return descriptionTag;
}

export function ToolPage() {
  const { toolId } = useParams();
  const tool = findToolById(toolId);

  const relatedTools = useMemo(() => {
    if (!tool) {
      return [];
    }

    return tools.filter((item) => item.category === tool.category && item.id !== tool.id).slice(0, 4);
  }, [tool]);

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = ensureMetaDescription();
    const previousDescription = descriptionTag.getAttribute('content') ?? '';

    if (tool) {
      document.title = `${tool.name} - 开发者工具箱`;
      descriptionTag.setAttribute(
        'content',
        `${tool.description}。在线使用 ${tool.name}，支持浏览器内即时处理，无需安装客户端。`,
      );
    }

    return () => {
      document.title = previousTitle;
      descriptionTag.setAttribute('content', previousDescription);
    };
  }, [tool]);

  if (!tool) {
    return (
      <div className="classic-shell py-16">
        <div className="classic-empty-state mx-auto max-w-3xl p-10 text-center">
          <Search className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-5 text-2xl font-semibold text-foreground">工具不存在</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">链接可能已失效，或者对应工具还没有注册到当前版本。</p>
          <Link
            to="/"
            className="classic-button classic-button-primary mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="classic-shell">
      <header className="classic-header sticky top-0 z-40">
        <div className="classic-layout px-0 py-4 sm:py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="classic-button classic-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回
                </Link>
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="classic-badge inline-flex items-center px-3 py-1 text-xs font-semibold">
                      {tool.categoryName}
                    </span>
                  </div>
                  <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {tool.name}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ThemeToggle />
              <a
                href={getToolPath(tool.id)}
                target="_blank"
                rel="noreferrer"
                className="classic-button classic-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                新标签打开
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="classic-layout grid gap-5 py-6 xl:grid-cols-[minmax(0,1fr)_280px] sm:py-8">
        <section className="classic-panel tool-content p-4 sm:p-6 lg:p-8">
          <ToolRenderer componentName={tool.component} />
        </section>

        <aside className="space-y-4">
          {relatedTools.length > 0 ? (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">相关工具</h2>
                <Link to="/" className="classic-link text-sm">
                  查看全部
                </Link>
              </div>
              <div className="space-y-3">
                {relatedTools.map((item) => (
                  <ToolCard key={item.id} tool={item} href={getToolPath(item.id)} compact />
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </main>
    </div>
  );
}
