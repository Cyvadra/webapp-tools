import { useEffect, useMemo } from 'react';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { Link, useParams } from 'react-router';
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
      <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Search className="mx-auto h-10 w-10 text-slate-300" />
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">工具不存在</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">链接可能已失效，或者对应工具还没有注册到当前版本。</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const Icon = tool.icon;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f9fbff_0%,_#ffffff_48%,_#f8fafc_100%)]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
                  <Icon className="h-7 w-7 text-sky-600" />
                </div>
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {tool.categoryName}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                      在线工具
                    </span>
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{tool.name}</h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{tool.description}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-500 hover:shadow-[0_16px_32px_rgba(2,132,199,0.34)]"
              >
                <ArrowLeft className="h-4 w-4" />
                返回工具列表
              </Link>
              <a
                href={getToolPath(tool.id)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                <ExternalLink className="h-4 w-4" />
                新标签打开
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tool.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1800px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">
          <ToolRenderer componentName={tool.component} />
        </section>

        <aside className="space-y-6">

          {relatedTools.length > 0 ? (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
                <Link to="/" className="text-sm text-sky-700 transition hover:text-sky-900">
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