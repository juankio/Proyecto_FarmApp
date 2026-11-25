type Marca = {
  color: string;
  fondo: string;
  sigla: string;
  franjas?: [string, string];
};

const MARCAS: Record<string, Marca> = {
  'La Rebaja': { color: '#b91c1c', fondo: '#fffdf7', sigla: 'LR', franjas: ['#dc2626', '#facc15'] },
  'Cruz Verde': { color: '#047857', fondo: '#fffdf7', sigla: '+' },
  Copifam: { color: '#1d4ed8', fondo: '#fffdf7', sigla: 'CF' },
  Farmacenter: { color: '#0369a1', fondo: '#fffdf7', sigla: 'FC' },
  'La Economía': { color: '#c2410c', fondo: '#fffdf7', sigla: '%' },
  Cafam: { color: '#9f1239', fondo: '#fffdf7', sigla: 'CAF', franjas: ['#be123c', '#fda4af'] },
  Audifarma: { color: '#0f766e', fondo: '#fffdf7', sigla: 'AUD' },
  Colsubsidio: { color: '#1e40af', fondo: '#fffdf7', sigla: 'COL' },
  'Droguería Alemana': { color: '#b45309', fondo: '#fffdf7', sigla: 'ALE' },
  Pasteur: { color: '#334155', fondo: '#fffdf7', sigla: 'P' },
  Independiente: { color: '#6d28d9', fondo: '#fffdf7', sigla: '+' },
};

const ASSETS: Record<string, string> = {
  'La Rebaja': '/logos/la-rebaja.png',
  'Cruz Verde': '/logos/cruz-verde.png',
  Farmacenter: '/logos/farmacenter.png',
  Audifarma: '/logos/audifarma.svg',
  Colsubsidio: '/logos/colsubsidio.png',
};

export function logoMarkup(cadena: string, size = 30): string {
  const asset = ASSETS[cadena];
  if (asset) {
    return `<img class="logo-marca-img" src="${asset}" width="${size}" height="${size}" alt="${cadena}" />`;
  }

  if (cadena === 'Independiente') {
    return `<svg class="logo-marca" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="Droguería de barrio">
      <circle cx="32" cy="32" r="30" fill="#1f6b4f" />
      <path d="M18 29h28c0 13-6 20-14 20s-14-7-14-20Z" fill="#f6f1e6" />
      <path d="M15 28h34" stroke="#f6f1e6" stroke-width="3.5" stroke-linecap="round" />
      <path d="M32 11v12M27 19l5 4 5-4" fill="none" stroke="#f6f1e6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`;
  }

  const marca = MARCAS[cadena] ?? MARCAS['Independiente'];
  const longitud = marca.sigla.length;
  const fontSize = longitud >= 3 ? 15 : longitud === 2 ? 21 : 28;

  return `<svg class="logo-marca" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${cadena}">
    <circle cx="32" cy="32" r="30" fill="${marca.color}" />
    <circle cx="32" cy="32" r="30" fill="none" stroke="#fffdf7" stroke-width="2" />
    <text x="32" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-0.5" fill="#fffdf7">${marca.sigla}</text>
  </svg>`;
}

export function colorMarca(cadena: string): string {
  return (MARCAS[cadena] ?? MARCAS['Independiente']).color;
}
