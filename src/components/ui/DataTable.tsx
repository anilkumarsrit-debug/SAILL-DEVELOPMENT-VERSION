import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  emptyState?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search table data...',
  searchFilter,
  pageSize = 8,
  emptyState,
  actions
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    if (searchFilter) {
      return data.filter((item) => searchFilter(item, searchQuery.toLowerCase()));
    }
    return data.filter((item) => {
      const json = JSON.stringify(item).toLowerCase();
      return json.includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchFilter]);

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortColumnKey) return filteredData;
    const col = columns.find((c) => c.key === sortColumnKey);
    if (!col || !col.sortValue) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = col.sortValue!(a);
      const valB = col.sortValue!(b);

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumnKey, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortColumnKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortColumnKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumnKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white border border-[#FAD7A0]/70 rounded-2xl shadow-xs overflow-hidden space-y-3">
      {/* Search & Actions Bar */}
      <div className="p-4 border-b border-gray-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFF8F0]/30">
        <div className="w-full sm:w-72">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
        {actions && <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">{actions}</div>}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#2C3E50] text-[#FAD7A0] font-serif">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-bold uppercase tracking-wider text-[11px] select-none ${col.className || ''}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                    >
                      <span>{col.header}</span>
                      {sortColumnKey === col.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-[#D35400]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-[#D35400]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[#2C3E50]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-400">
                  {emptyState || 'No record matching search filters'}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={keyExtractor(item)} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 align-middle ${col.className || ''}`}>
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden p-3 space-y-3">
        {paginatedData.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            {emptyState || 'No record matching search filters'}
          </div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={keyExtractor(item)}
              className="bg-[#FFF8F0]/40 p-3.5 rounded-xl border border-[#FAD7A0]/70 space-y-2 text-xs"
            >
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-start gap-2 border-b border-gray-100/60 pb-1.5 last:border-b-0 last:pb-0">
                  <span className="font-bold text-[#2C3E50] shrink-0 text-[11px] uppercase tracking-wider">
                    {col.header}:
                  </span>
                  <div className="text-right text-[#5D6D7E] flex-1">{col.accessor(item)}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>


      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-[#FFF8F0]/20">
          <span>
            Showing <strong className="text-[#2C3E50]">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-[#2C3E50]">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </strong>{' '}
            of <strong className="text-[#2C3E50]">{sortedData.length}</strong> entries
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 font-bold text-[#2C3E50]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
