export function optimizarCloudinary(url: string, ancho?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const esGif = /\.gif(\?|$)/i.test(url);
  const partes: string[] = [];
  if (ancho) partes.push(`w_${ancho}`);
  partes.push('q_auto');
  if (!esGif) partes.push('f_auto');

  const transform = partes.join(',');
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
}
