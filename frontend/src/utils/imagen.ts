export function optimizarCloudinary(url: string, ancho?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const despues = url.slice(idx + marker.length);
  const primerSegmento = despues.split('/')[0];

  // Idempotencia: si ya hay transformaciones, no duplicar.
  const yaTransformado =
    primerSegmento.includes(',') ||
    /^[a-z]+_[a-zA-Z0-9]/.test(primerSegmento);
  if (yaTransformado) return url;

  const esGif = /\.gif(\?|$)/i.test(url);
  const partes: string[] = [];
  if (ancho) partes.push(`w_${ancho}`);
  partes.push('q_auto');
  if (!esGif) partes.push('f_auto');

  const transform = partes.join(',');
  return url.replace(marker, `${marker}${transform}/`);
}
