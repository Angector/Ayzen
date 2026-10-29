export function renderTemplate(template, values) {
  return template.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (match, key) => {
    const val = values[key];
    return val !== undefined && val !== null ? String(val) : match;
  });
}

export function extractVariables(template) {
  const re = /\{\{\s*([\w-]+)\s*\}\}/g;
  const seen = new Set();
  const out = [];
  let m;
  while ((m = re.exec(template)) !== null) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}

export function missingVariables(template, values) {
  return extractVariables(template).filter(k => {
    const v = values[k];
    return v === undefined || v === null || String(v).trim() === '';
  });
}