import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Tool } from '../data/tools';

interface ToolCardProps {
  tool: Tool;
  href: string;
  compact?: boolean;
}

export function ToolCard({ tool, href, compact = false }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      to={href}
      className={`group block rounded-3xl border border-slate-200 bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_14px_30px_rgba(14,116,144,0.10)] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 transition-transform group-hover:scale-105">
          <Icon className="h-5 w-5 text-sky-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-slate-900 transition-colors group-hover:text-sky-700">{tool.name}</h3>
              <p className={`mt-1 text-sm text-slate-500 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
                {tool.description}
              </p>
            </div>
            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-sky-600" />
          </div>

          {!compact ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
