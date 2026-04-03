import { pinyin } from 'pinyin-pro';
import type { Tool } from '../data/tools';

interface SearchIndex {
  raw: string;
  compact: string;
  pinyin: string;
  pinyinCompact: string;
  initials: string;
}

const searchIndexCache = new Map<string, SearchIndex>();

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function compactSearchText(value: string) {
  return normalizeSearchText(value).replace(/[^a-z0-9\u4e00-\u9fff]+/g, '');
}

function toPinyinSegments(value: string) {
  const source = value.trim();

  if (!source) {
    return [];
  }

  return pinyin(source, {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive',
    v: true,
  }).map((segment) => segment.toLowerCase());
}

function buildSearchIndex(value: string): SearchIndex {
  const cachedIndex = searchIndexCache.get(value);

  if (cachedIndex) {
    return cachedIndex;
  }

  const segments = toPinyinSegments(value);
  const searchIndex = {
    raw: normalizeSearchText(value),
    compact: compactSearchText(value),
    pinyin: segments.join(' '),
    pinyinCompact: segments.join(''),
    initials: segments.map((segment) => segment[0] ?? '').join(''),
  };

  searchIndexCache.set(value, searchIndex);

  return searchIndex;
}

function isSubsequenceMatch(target: string, query: string) {
  if (!query) {
    return true;
  }

  let queryIndex = 0;

  for (const character of target) {
    if (character === query[queryIndex]) {
      queryIndex += 1;

      if (queryIndex === query.length) {
        return true;
      }
    }
  }

  return false;
}

function fuzzyMatch(target: string, query: string) {
  if (!target || !query) {
    return false;
  }

  return target.includes(query) || isSubsequenceMatch(target, query);
}

export function matchesToolSearch(tool: Tool, query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const compactQuery = compactSearchText(normalizedQuery);
  const searchSources = [tool.name, tool.description, tool.categoryName, ...tool.keywords];

  return searchSources.some((value) => {
    const searchIndex = buildSearchIndex(value);

    return (
      fuzzyMatch(searchIndex.raw, normalizedQuery) ||
      fuzzyMatch(searchIndex.compact, compactQuery) ||
      fuzzyMatch(searchIndex.pinyin, normalizedQuery) ||
      fuzzyMatch(searchIndex.pinyinCompact, compactQuery) ||
      fuzzyMatch(searchIndex.initials, compactQuery)
    );
  });
}