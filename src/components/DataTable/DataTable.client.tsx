import { useMemo, useState } from "react";
import type {
  DataTablePayload,
  FilterRule,
  SerializedColMeta,
  SortRule,
} from "./types";
import { colIndexByKey, compare, findCol, matchesFilter, newId } from "./logic";
import { FilterForm } from "./FilterForm";
import { SortForm } from "./SortForm";
import { HeaderMenu } from "./HeaderMenu";
import "./DataTable.css";

type FormKind = "filter" | "sort" | "header" | null;
interface FormState {
  kind: FormKind;
  presetField?: string;
  headerKey?: string;
}

export default function DataTableReact({
  payload,
}: {
  payload: DataTablePayload;
}) {
  const { cols, rows, defaultSort } = payload;

  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [sorts, setSorts] = useState<SortRule[]>(() =>
    defaultSort.map((s) => {
      const col = findCol(cols, s.key);
      return {
        id: newId(),
        field: s.key,
        type: col?.type ?? "string",
        asc: s.asc,
      };
    }),
  );
  const [form, setForm] = useState<FormState>({ kind: null });

  const visibleRows = useMemo(() => {
    const filtered = rows.filter((row) => {
      for (const f of filters) {
        const idx = colIndexByKey(cols, f.field);
        const val = row.cells[idx]?.sortValue ?? "";
        if (!matchesFilter(val, f)) return false;
      }
      return true;
    });
    if (sorts.length > 0) {
      filtered.sort((ra, rb) => {
        for (const s of sorts) {
          const idx = colIndexByKey(cols, s.field);
          const av = ra.cells[idx]?.sortValue ?? "";
          const bv = rb.cells[idx]?.sortValue ?? "";
          const c = compare(av, bv, s.type, s.asc);
          if (c !== 0) return c;
        }
        return 0;
      });
    }
    return filtered;
  }, [rows, filters, sorts, cols]);

  function handleAddFilter(rule: Omit<FilterRule, "id">) {
    setFilters((prev) => [...prev, { ...rule, id: newId() }]);
    setForm({ kind: null });
  }

  function handleAddSort(rule: Omit<SortRule, "id">) {
    setSorts((prev) => [...prev, { ...rule, id: newId() }]);
    setForm({ kind: null });
  }

  function handleToggleSort(key: string) {
    setSorts((prev) => {
      const existing = prev.find((s) => s.field === key);
      if (existing) {
        return prev.map((s) => (s.field === key ? { ...s, asc: !s.asc } : s));
      }
      const meta = findCol(cols, key);
      return [
        { id: newId(), field: key, type: meta?.type ?? "string", asc: true },
        ...prev,
      ];
    });
    setForm({ kind: null });
  }

  function handleReset() {
    setFilters([]);
    setSorts(
      defaultSort.map((s) => {
        const col = findCol(cols, s.key);
        return {
          id: newId(),
          field: s.key,
          type: col?.type ?? "string",
          asc: s.asc,
        };
      }),
    );
    setForm({ kind: null });
  }

  function handleHeaderClick(meta: SerializedColMeta) {
    if (!meta.sortable && !meta.filterable) return;
    setForm({ kind: "header", headerKey: meta.key });
  }

  const headerMeta =
    form?.kind === "header" && form.headerKey
      ? findCol(cols, form.headerKey)
      : undefined;

  return (
    <div className="dt-wrapper">
      <div className="dt-toolbar">
        <div className="dt-rules">
          {filters.length === 0 && sorts.length === 0 && (
            <span className="dt-rules-empty">
              No active rules — click + Filter / + Sort, or a column header.
            </span>
          )}
          {filters.map((f) => {
            const meta = findCol(cols, f.field);
            return (
              <span key={f.id} className="dt-chip dt-chip-filter">
                <span className="dt-chip-glyph">⌕</span>
                <span>
                  {meta?.label ?? f.field} {f.op} &quot;{f.value}&quot;
                </span>
                <button
                  type="button"
                  className="dt-chip-remove"
                  title="Remove"
                  onClick={() =>
                    setFilters((prev) => prev.filter((x) => x.id !== f.id))
                  }
                >
                  ✕
                </button>
              </span>
            );
          })}
          {sorts.map((s, i) => {
            const meta = findCol(cols, s.field);
            return (
              <span key={s.id} className="dt-chip dt-chip-sort">
                <span className="dt-chip-idx">{i + 1}</span>
                <span>{meta?.label ?? s.field}</span>
                <button
                  type="button"
                  className="dt-chip-toggle"
                  title="Toggle direction"
                  onClick={() =>
                    setSorts((prev) =>
                      prev.map((x) =>
                        x.id === s.id ? { ...x, asc: !x.asc } : x,
                      ),
                    )
                  }
                >
                  {s.asc ? "↑" : "↓"}
                </button>
                <button
                  type="button"
                  className="dt-chip-remove"
                  title="Remove"
                  onClick={() =>
                    setSorts((prev) => prev.filter((x) => x.id !== s.id))
                  }
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
        <div className="dt-actions">
          <button
            type="button"
            className="dt-btn"
            onClick={() => setForm({ kind: "filter" })}
          >
            + Filter
          </button>
          <button
            type="button"
            className="dt-btn dt-sort-btn"
            onClick={() => setForm({ kind: "sort" })}
          >
            + Sort
          </button>
          <button
            type="button"
            className="dt-btn dt-reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="dt-form-slot">
        {form?.kind === "filter" && (
          <FilterForm
            cols={cols}
            presetField={form.presetField}
            onAdd={handleAddFilter}
            onCancel={() => setForm({ kind: null })}
          />
        )}
        {form?.kind === "sort" && (
          <SortForm
            cols={cols}
            onAdd={handleAddSort}
            onCancel={() => setForm({ kind: null })}
          />
        )}
        {form?.kind === "header" && headerMeta && (
          <HeaderMenu
            meta={headerMeta}
            existingSort={sorts.find((s) => s.field === headerMeta.key)}
            onFilter={() =>
              setForm({ kind: "filter", presetField: headerMeta.key })
            }
            onToggleSort={() => handleToggleSort(headerMeta.key)}
            onClose={() => setForm({ kind: null })}
          />
        )}
      </div>

      <div className="dt-scroll">
        <table className="dt-table">
          <thead>
            <tr>
              {cols.map((c) => {
                const sortIdx = sorts.findIndex((s) => s.field === c.key);
                const badge =
                  sortIdx === -1
                    ? ""
                    : `${sorts[sortIdx].asc ? "↑" : "↓"}${sortIdx + 1}`;
                const interactive = c.sortable || c.filterable;
                return (
                  <th
                    key={c.key}
                    className={interactive ? "dt-th-interactive" : undefined}
                    onClick={
                      interactive ? () => handleHeaderClick(c) : undefined
                    }
                  >
                    <span className="dt-th-label">{c.label}</span>
                    <span className="dt-th-badge">{badge}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={i}>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cell.className}
                    dangerouslySetInnerHTML={{ __html: cell.html }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
