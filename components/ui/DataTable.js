'use client';

import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

// columns: [{ key, header, align, render?, sortValue? }]
export default function DataTable({
  columns,
  rows,
  searchKeys = [],
  initialSort,
  pageSize = 0
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(
    initialSort || { key: null, dir: 'desc' }
  );
  const [visible, setVisible] = useState(pageSize || rows.length);

  const filtered = useMemo(() => {
    if (!query || searchKeys.length === 0) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const val = (r) => (col?.sortValue ? col.sortValue(r) : r[sort.key]);
    return [...filtered].sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sort.dir === 'asc' ? av - bv : bv - av;
      }
      return sort.dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sort, columns]);

  const shown = pageSize ? sorted.slice(0, visible) : sorted;

  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' }
    );

  return (
    <div>
      {searchKeys.length > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-ink-700 px-3">
          <Search size={15} className="text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter\u2026"
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="text-xs uppercase tracking-wide text-gray-500">
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => c.sortable !== false && toggleSort(c.key)}
                  className={`bg-ink-800/95 py-2.5 ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  } ${c.hideMobile ? 'hidden md:table-cell' : ''} ${
                    c.sortable !== false ? 'cursor-pointer select-none hover:text-gray-300' : ''
                  }`}
                >
                  <span className={`inline-flex items-center gap-1 ${c.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    {c.header}
                    {sort.key === c.key &&
                      (sort.dir === 'asc' ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr
                key={r.id ?? i}
                className="border-t border-white/5 transition hover:bg-white/5"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-2.5 ${
                      c.align === 'right' ? 'text-right' : 'text-left'
                    } ${c.hideMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageSize > 0 && visible < sorted.length && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + pageSize)}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs text-gray-300 hover:border-neon/40 hover:text-neon"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
