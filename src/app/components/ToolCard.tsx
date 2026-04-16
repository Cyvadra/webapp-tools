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
      className={`classic-card group block text-left ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-start gap-3">
        <div className="classic-icon-frame flex h-11 w-11 items-center justify-center transition-transform group-hover:-translate-y-px">
          <Icon className="h-5 w-5 text-[var(--accent-foreground)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-foreground transition-colors group-hover:text-[var(--primary)]">
                {tool.name}
              </h3>
              <p className={`mt-1 text-sm text-muted-foreground ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
                {tool.description}
              </p>
            </div>
            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition group-hover:text-[var(--primary)]" />
          </div>

          {!compact ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.keywords.slice(0, 3).map((keyword) => (
                <span key={keyword} className="classic-chip px-2.5 py-1 text-xs font-medium">
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
