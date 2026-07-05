import { useEffect, useRef, useState } from "react";
import type { SerializedColMeta, SortRule } from "./types";
import { findCol } from "./logic";

export function SortForm({
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
