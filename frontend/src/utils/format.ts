export function formatFecha(value: string): string {
  if (!value) return value;

  // Respetar el offset informado por el backend: no asumir UTC ni añadir 'Z'.
  // Si viene con espacio en lugar de 'T', normalizar separador sin forzar zona.
  const iso = value.includes('T') ? value : value.replace(' ', 'T');
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

export function formatPrecioCop(valor: number): string {
  return `$ ${Math.round(valor).toLocaleString('es-CO')}`;
}
