import type {
  ColumnType,
  FilterOp,
  FilterRule,
  SerializedColMeta,
} from "./types";

let nextId = 1;
export const newId = () => `r${nextId++}`;

export function compare(
  a: string,
  b: string,
  type: ColumnType,
  asc: boolean,
): number {
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

export function matchesFilter(value: string, rule: FilterRule): boolean {
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
}

export function opsForType(type: ColumnType): { v: FilterOp; t: string }[] {
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

export function findCol(
  cols: SerializedColMeta[],
  key: string,
): SerializedColMeta | undefined {
  return cols.find((c) => c.key === key);
}

export function colIndexByKey(cols: SerializedColMeta[], key: string): number {
  return cols.findIndex((c) => c.key === key);
}
