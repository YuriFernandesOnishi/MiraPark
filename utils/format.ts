export function formatDateTime(dateStr: string, timeStr?: string) {

  try {
    const iso = timeStr ? `${dateStr}T${timeStr}` : dateStr;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return `${dateStr} ${timeStr ?? ""}`;
    return d.toLocaleString();
  } catch {
    return `${dateStr} ${timeStr ?? ""}`;
  }
}
