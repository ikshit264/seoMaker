'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { BlockProps } from '@/lib/blocks/registry';

const TableCell = ({ 
  content, 
  isExpanded, 
  onToggle, 
  readOnly, 
  onChange 
}: { 
  content: string, 
  isExpanded: boolean, 
  onToggle: () => void, 
  readOnly?: boolean,
  onChange?: (val: string) => void
}) => {
  const shouldTruncate = content.length > 150;
  const displayContent = shouldTruncate && !isExpanded ? content.substring(0, 150) + '...' : content;

  if (readOnly) {
    return (
      <div className="py-4 px-6 min-w-[200px] md:min-w-[300px]">
        <div className="text-sm text-zinc-600 leading-relaxed break-words whitespace-pre-wrap">
          {displayContent}
        </div>
        {shouldTruncate && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>See More <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-w-[200px] md:min-w-[300px] group relative">
      <textarea
        value={content}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full p-4 text-sm text-zinc-700 outline-none focus:bg-indigo-50/30 transition-colors bg-transparent border-none resize-none min-h-[60px]"
        placeholder="..."
        rows={isExpanded || !shouldTruncate ? undefined : 3}
        style={{ height: isExpanded || !shouldTruncate ? 'auto' : '80px' }}
      />
      {shouldTruncate && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute bottom-1 right-2 text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      )}
    </div>
  );
};

export const TableBlock: React.FC<BlockProps<any>> = ({ id, isEditMode, content, depth, onChange }) => {
  const readOnly = !isEditMode;
  const rows = Array.isArray(content?.rows) ? content.rows : [['Header 1', 'Header 2'], ['Content 1', 'Content 2']];
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});

  const toggleExpand = (rowIndex: number, colIndex: number) => {
    const key = `${rowIndex}-${colIndex}`;
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    onChange?.({ content: { ...content, rows: newRows } });
  };

  const addRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const colCount = rows[0]?.length || 1;
    const newRow = new Array(colCount).fill('');
    onChange?.({ content: { ...content, rows: [...rows, newRow] } });
  };

  const addCol = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRows = rows.map((row: string[]) => [...row, '']);
    onChange?.({ content: { ...content, rows: newRows } });
  };

  const removeRow = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (rows.length <= 1) return;
    const newRows = rows.filter((_: string[], i: number) => i !== index);
    onChange?.({ content: { ...content, rows: newRows } });
  };

  const removeCol = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (rows[0].length <= 1) return;
    const newRows = rows.map((row: string[]) => row.filter((_: string, i: number) => i !== index));
    onChange?.({ content: { ...content, rows: newRows } });
  };

  if (readOnly) {
    return (
      <div className="my-8 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl bg-white">
        <div className="overflow-x-auto custom-scrollbar-horizontal">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
                {rows[0].map((_: any, i: number) => (
                    <col key={i} className="w-[200px] md:w-[300px]" />
                ))}
            </colgroup>
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                {rows[0].map((cell: string, i: number) => (
                  <th key={i} className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-r border-zinc-200 last:border-r-0">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {rows.slice(1).map((row: string[], rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-zinc-50/30 transition-colors">
                  {row.map((cell: string, colIndex: number) => (
                    <td key={colIndex} className="p-0 border-r border-zinc-200 last:border-r-0 align-top">
                      <TableCell 
                        content={cell} 
                        isExpanded={!!expandedCells[`${rowIndex + 1}-${colIndex}`]}
                        onToggle={() => toggleExpand(rowIndex + 1, colIndex)}
                        readOnly={true}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm bg-white">
        <div className="overflow-x-auto custom-scrollbar-horizontal">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
                <col className="w-12" />
                {rows[0].map((_: any, i: number) => (
                    <col key={i} className="w-[200px] md:w-[300px]" />
                ))}
                <col className="w-12" />
            </colgroup>
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="w-12"></th>
                {rows[0].map((_: string, i: number) => (
                  <th key={i} className="p-3 border-r border-zinc-200 last:border-r-0 group relative bg-zinc-50/50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Col {i + 1}</span>
                      <button 
                        type="button"
                        onClick={(e) => removeCol(e, i)}
                        className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/20">
                  <td className="p-2 text-center group">
                     <button 
                      type="button"
                      onClick={(e) => removeRow(e, rowIndex)}
                      className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </td>
                  {row.map((cell: string, colIndex: number) => (
                    <td key={colIndex} className="p-0 border-r border-zinc-200 last:border-r-0 align-top">
                      <TableCell 
                        content={cell}
                        isExpanded={!!expandedCells[`${rowIndex}-${colIndex}`]}
                        onToggle={() => toggleExpand(rowIndex, colIndex)}
                        onChange={(val) => updateCell(rowIndex, colIndex, val)}
                      />
                    </td>
                  ))}
                  <td className="w-12"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Row
        </button>
        <button
          type="button"
          onClick={addCol}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Column
        </button>
      </div>
    </div>
  );
}
