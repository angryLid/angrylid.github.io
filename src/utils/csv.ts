export function parseCSV<T = Record<string, string>>(text: string): T[] {
  const rows: T[] = [];
  let headers: string[] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let headerParsed = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"') {
        if (next === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (ch === "\n") {
        currentRow.push(currentField.trim());
        currentField = "";
        if (currentRow.length > 1 || currentRow[0] !== "") {
          if (!headerParsed) {
            headers = currentRow;
            headerParsed = true;
          } else {
            const obj = {} as T;
            headers.forEach((h, idx) => {
              (obj as Record<string, string>)[h] = currentRow[idx] ?? "";
            });
            rows.push(obj);
          }
        }
        currentRow = [];
      } else if (ch === "\r") {
        // skip
      } else {
        currentField += ch;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 1 || currentRow[0] !== "") {
      const obj = {} as T;
      headers.forEach((h, idx) => {
        (obj as Record<string, string>)[h] = currentRow[idx] ?? "";
      });
      rows.push(obj);
    }
  }

  return rows;
}
