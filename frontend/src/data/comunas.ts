export type Comuna = {
  id: number;
  nombre: string;
  barrios: string[];
  centro: [number, number];
  color: string;
};

// División político-administrativa de Villavicencio (10 comunas, según datos abiertos de la Alcaldía y Wikipedia 2026).
export const COMUNAS: Comuna[] = [
  { id: 1, nombre: 'Caudal y La Grama', barrios: ['caudal', 'la grama', 'panorama', 'el triunfo', 'doce de octubre', 'emporio', 'maizaro'], centro: [4.157, -73.641], color: '#c05a32' },
  { id: 2, nombre: 'Centro y Barzal', barrios: ['centro', 'barzal', 'san fernando', 'siete de agosto', 'buque', 'trapiche', 'villa maría', 'villa codem'], centro: [4.149, -73.637], color: '#1f6b4f' },
  { id: 3, nombre: 'Porvenir e Industrial', barrios: ['porvenir', 'veinte de julio', 'san isidro', 'industrial', 'villa julia', 'santa inés', 'san gregorio'], centro: [4.152, -73.630], color: '#2a6480' },
  { id: 4, nombre: 'Santa Helena y Jordán', barrios: ['santa helena', 'jordán', 'morichal', 'el popular', 'castilla', 'juan pablo ii', 'villa ortiz'], centro: [4.147, -73.616], color: '#d89a2b' },
  { id: 5, nombre: 'Kirpas y El Estero', barrios: ['kirpas', 'estero', 'maracos', 'primavera', 'terminal', 'bochica', 'vizcaya', 'danubio'], centro: [4.135, -73.608], color: '#7c3aed' },
  { id: 6, nombre: 'San Benito y Maizaro', barrios: ['san benito', 'maizaro', 'guatiquía', 'nogal', 'caney', 'sausalito'], centro: [4.141, -73.635], color: '#0f766e' },
  { id: 7, nombre: 'La Esperanza y Centauros', barrios: ['esperanza', 'centauros', 'rosa blanca', 'jardín', 'comuneros', 'alborada'], centro: [4.128, -73.633], color: '#e11d48' },
  { id: 8, nombre: 'Montecarlo y Catumare', barrios: ['montecarlo', 'catumare', 'guatapé', 'san jorge', 'serramonte', 'porfía'], centro: [4.108, -73.640], color: '#ea580c' },
  { id: 9, nombre: 'Porfía y La Madrid', barrios: ['porfía', 'la madrid', 'ciudad jardín', 'gramalote', 'brasilia'], centro: [4.078, -73.668], color: '#2563eb' },
  { id: 10, nombre: 'La Reliquia', barrios: ['reliquia', 'brillante', 'san Antonio', 'trece de mayo', 'vanguardia', 'apiay'], centro: [4.137, -73.585], color: '#b45309' },
];

export function comunaDe(_barrio: string, _direccion: string, lat: number, lng: number): number {
  // Asignación por proximidad al centroide de cada comuna (1° ≈ 111 km en ambas ejes a esta latitud).
  let mejor = 2;
  let menor = Infinity;
  for (const comuna of COMUNAS) {
    const d = Math.hypot(lat - comuna.centro[0], lng - comuna.centro[1]);
    if (d < menor) { menor = d; mejor = comuna.id; }
  }
  return mejor;
}

export function comunaPorId(id: number | null | undefined): Comuna | null {
  return COMUNAS.find((c) => c.id === id) ?? null;
}
