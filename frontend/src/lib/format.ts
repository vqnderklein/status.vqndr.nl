const TZ = 'Europe/Amsterdam';

const dayFmt = new Intl.DateTimeFormat('nl-BE', {
  weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ,
});

const timeFmt = new Intl.DateTimeFormat('nl-BE', {
  hour: '2-digit', minute: '2-digit', timeZone: TZ,
});

const dayKey = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: TZ });

export function formatWindow(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const from = `${dayFmt.format(start)}, ${timeFmt.format(start)}`;

  const to = dayKey(start) === dayKey(end)
    ? timeFmt.format(end)
    : `${dayFmt.format(end)}, ${timeFmt.format(end)}`;

  return `${from} tot ${to}`;
}