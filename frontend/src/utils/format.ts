export function formatFecha(value: string): string {
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return value;

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha);
}

export function iniciales(nombres: string, apellidos: string): string {
  const a = nombres.trim().charAt(0);
  const b = apellidos.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || 'FA';
}
