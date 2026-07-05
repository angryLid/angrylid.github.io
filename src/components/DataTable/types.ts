// === seam (server produces, client consumes) ===
export type ColumnType = "string" | "number" | "date";

export interface SortLevel {
  key: string;
  asc: boolean;
}

export interface SerializedCell {
  html: string;
  sortValue: string;
  className?: string;
}

export interface SerializedRow {
  cells: SerializedCell[];
}

export interface SerializedColMeta {
  key: string;
  label: string;
  type: ColumnType;
  sortable: boolean;
  filterable: boolean;
  className?: string;
}

export interface DataTablePayload {
  cols: SerializedColMeta[];
  rows: SerializedRow[];
  defaultSort: SortLevel[];
}

// === server-only (used by DataTable.astro) ===
export interface Column {
  key: string;
  label: string;
  type?: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  format?: (value: any) => string;
  render?: (row: Record<string, any>) => string;
}

export interface Props {
  data: Record<string, any>[];
  columns: Column[];
  defaultSort?: SortLevel[];
}

// === client-only (used by DataTable.client.tsx + sub-components) ===
export type StringOp = "contains";
export type NumberDateOp = "=" | "!=" | ">" | ">=" | "<" | "<=";
export type FilterOp = StringOp | NumberDateOp;

export interface FilterRule {
  id: string;
  field: string;
  type: ColumnType;
  op: FilterOp;
  value: string;
}

export interface SortRule {
  id: string;
  field: string;
  type: ColumnType;
  asc: boolean;
}
