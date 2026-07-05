export type ColumnType = "string" | "number" | "date";

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

export interface SortLevel {
  key: string;
  asc: boolean;
}

export interface Props {
  data: Record<string, any>[];
  columns: Column[];
  defaultSort?: SortLevel[];
}

export type StringOp = "contains";
export type NumberDateOp = "=" | "!=" | ">" | ">=" | "<" | "<=";

export interface FilterRule {
  id: string;
  field: string;
  type: ColumnType;
  op: StringOp | NumberDateOp;
  value: string;
}

export interface SortRule {
  id: string;
  field: string;
  type: ColumnType;
  asc: boolean;
}
