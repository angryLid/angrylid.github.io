import type { SerializedColMeta, SortRule } from "./types";

export function HeaderMenu({
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
