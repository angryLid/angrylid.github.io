import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type {
  ColumnType,
  DataTablePayload,
  SerializedColMeta,
} from "./DataTable.types";
import "./DataTable.css";

type FilterOp = "contains" | "=" | "!=" | ">" | ">=" | "<" | "<=";

interface FilterRule {
  id: string;
  field: string;
  type: ColumnType;
  op: FilterOp;
  value: string;
}

interface SortRule {
  id: string;
  field: string;
  type: ColumnType;
  asc: boolean;
}

type FormKind = "filter" | "sort" | "header" | null;
interface FormState {
  kind: FormKind;
  presetField?: string;
  headerKey?: string;
}

let nextId = 1;
const newId = () => `r${nextId++}`;

function compare(a: string, b: string, type: ColumnType, asc: boolean): number {
  let cmp: number;
  if (type === "number") {
    cmp = (parseFloat(a) || 0) - (parseFloat(b) || 0);
  } else if (type === "date") {
    const norm = (s: string) => String(s).replace(/\//g, "-");
    const at = Date.parse(norm(a));
    const bt = Date.parse(norm(b));
    if (Number.isNaN(at) && Number.isNaN(bt)) cmp = 0;
    else if (Number.isNaN(at)) cmp = 1;
    else if (Number.isNaN(bt)) cmp = -1;
    else cmp = at - bt;
  } else {
    cmp = new Intl.Collator().compare(a, b);
  }
  return asc ? cmp : -cmp;
}

function matchesFilter(value: string, rule: FilterRule): boolean {
  if (rule.op === "contains") {
    return value.toLowerCase().includes(rule.value.toLowerCase());
  }
  const num = parseFloat(value);
  const target = parseFloat(rule.value);
  if (Number.isNaN(num) || Number.isNaN(target)) {
    if (rule.op === "!=") return value !== rule.value;
    return false;
  }
  switch (rule.op) {
    case "=":
      return num === target;
    case "!=":
      return num !== target;
    case ">":
      return num > target;
    case ">=":
      return num >= target;
    case "<":
      return num < target;
    case "<=":
      return num <= target;
  }
  return true;
}

function opsForType(type: ColumnType): { v: FilterOp; t: string }[] {
  return type === "string"
    ? [{ v: "contains", t: "contains" }]
    : [
        { v: "=", t: "=" },
        { v: "!=", t: "≠" },
        { v: ">", t: ">" },
        { v: ">=", t: "≥" },
        { v: "<", t: "<" },
        { v: "<=", t: "≤" },
      ];
}

function findCol(
  cols: SerializedColMeta[],
  key: string,
): SerializedColMeta | undefined {
  return cols.find((c) => c.key === key);
}

function colIndexByKey(cols: SerializedColMeta[], key: string): number {
  return cols.findIndex((c) => c.key === key);
}

function FilterForm({
  cols,
  presetField,
  onAdd,
  onCancel,
}: {
  cols: SerializedColMeta[];
  presetField?: string;
  onAdd: (rule: Omit<FilterRule, "id">) => void;
  onCancel: () => void;
}) {
  const filterable = cols.filter((c) => c.filterable);
  const [field, setField] = useState(presetField ?? filterable[0]?.key ?? "");
  const meta = findCol(cols, field);
  const [op, setOp] = useState<FilterOp>(
    opsForType(meta?.type ?? "string")[0]?.v ?? "contains",
  );
  const [value, setValue] = useState("");
  const valueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    valueRef.current?.focus();
  }, []);

  function handleFieldChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setField(next);
    const nextMeta = findCol(cols, next);
    setOp(opsForType(nextMeta?.type ?? "string")[0]?.v ?? "contains");
  }

  function handleAdd() {
    if (!value) {
      valueRef.current?.focus();
      return;
    }
    onAdd({ field, type: meta?.type ?? "string", op, value });
  }

  const ops = opsForType(meta?.type ?? "string");

  return (
    <div className="dt-form">
      <span className="dt-form-label">Where</span>
      <select value={field} onChange={handleFieldChange}>
        {filterable.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <select value={op} onChange={(e) => setOp(e.target.value as FilterOp)}>
        {ops.map((o) => (
          <option key={o.v} value={o.v}>
            {o.t}
          </option>
        ))}
      </select>
      <input
        ref={valueRef}
        type="text"
        placeholder="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      <button type="button" className="dt-btn dt-form-add" onClick={handleAdd}>
        Add
      </button>
      <button
        type="button"
        className="dt-btn dt-form-cancel"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

function SortForm({
  cols,
  onAdd,
  onCancel,
}: {
  cols: SerializedColMeta[];
  onAdd: (rule: Omit<SortRule, "id">) => void;
  onCancel: () => void;
}) {
  const sortable = cols.filter((c) => c.sortable);
  const [field, setField] = useState(sortable[0]?.key ?? "");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const fieldRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fieldRef.current?.focus();
  }, []);

  const meta = findCol(cols, field);

  function handleAdd() {
    onAdd({ field, type: meta?.type ?? "string", asc: dir === "asc" });
  }

  return (
    <div className="dt-form">
      <span className="dt-form-label">Sort by</span>
      <select
        ref={fieldRef}
        value={field}
        onChange={(e) => setField(e.target.value)}
      >
        {sortable.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={dir}
        onChange={(e) => setDir(e.target.value as "asc" | "desc")}
      >
        <option value="asc">↑ Asc</option>
        <option value="desc">↓ Desc</option>
      </select>
      <button type="button" className="dt-btn dt-form-add" onClick={handleAdd}>
        Add
      </button>
      <button
        type="button"
        className="dt-btn dt-form-cancel"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

function HeaderMenu({
  meta,
  existingSort,
  onFilter,
  onToggleSort,
  onClose,
}: {
  meta: SerializedColMeta;
  existingSort?: SortRule;
  onFilter: () => void;
  onToggleSort: () => void;
  onClose: () => void;
}) {
  return (
    <div className="dt-form dt-header-menu">
      {meta.filterable && (
        <button type="button" className="dt-btn" onClick={onFilter}>
          Filter…
        </button>
      )}
      {meta.sortable && (
        <button type="button" className="dt-btn" onClick={onToggleSort}>
          {existingSort
            ? `Toggle ${existingSort.asc ? "↓ Desc" : "↑ Asc"}`
            : "Sort ↑ Asc"}
        </button>
      )}
      <button type="button" className="dt-btn dt-form-cancel" onClick={onClose}>
        Close
      </button>
    </div>
  );
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
