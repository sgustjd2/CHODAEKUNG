import type { CalendarDay } from "./types";

/** Sun-first month grid: leading/trailing days dimmed, `highlight` (1-based day) marked as the
 * event day. Shared by the romantic sample and the wizard's blank-start date fill. */
export function monthGrid(year: number, month0: number, highlight: number): CalendarDay[] {
  const lead = new Date(year, month0, 1).getDay();
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const prevMonthDays = new Date(year, month0, 0).getDate();
  const cells: CalendarDay[] = [];
  for (let i = lead - 1; i >= 0; i--) cells.push({ n: prevMonthDays - i, dim: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push(d === highlight ? { n: d, today: true } : { n: d });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ n: next++, dim: true });
  return cells;
}
