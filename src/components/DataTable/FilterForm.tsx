import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { FilterOp, FilterRule, SerializedColMeta } from "./types";
import { findCol, opsForType } from "./logic";

export function FilterForm({
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
