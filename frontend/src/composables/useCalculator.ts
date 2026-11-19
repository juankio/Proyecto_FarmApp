import { computed, ref } from 'vue';

type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' }
  | { type: 'paren'; value: '(' | ')' };

const OPERADORES = new Set(['+', '-', '*', '/']);

function tokenizar(expresion: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const texto = expresion.trim();
  while (i < texto.length) {
    const char = texto[i];
    if (char === ' ') {
      i += 1;
      continue;
    }
    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char });
      i += 1;
      continue;
    }
    if (OPERADORES.has(char)) {
      tokens.push({ type: 'operator', value: char as '+' | '-' | '*' | '/' });
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(char)) {
      let numero = '';
      while (i < texto.length && /[0-9.]/.test(texto[i])) {
        numero += texto[i];
        i += 1;
      }
      const valor = Number(numero);
      if (!Number.isFinite(valor)) throw new Error('Número no válido');
      tokens.push({ type: 'number', value: valor });
      continue;
    }
    throw new Error('Carácter no válido');
  }
  return tokens;
}

class ParserAritmetico {
  private posicion = 0;
  constructor(private readonly tokens: Token[]) {}

  parsear(): number {
    const resultado = this.expresion();
    if (this.posicion !== this.tokens.length) throw new Error('Expresión no válida');
    return resultado;
  }

  private expresion(): number {
    let resultado = this.termino();
    while (this.coincideOperador(['+', '-'])) {
      const operador = this.tokens[this.posicion - 1] as { type: 'operator'; value: '+' | '-' };
      const derecho = this.termino();
      resultado = operador.value === '+' ? resultado + derecho : resultado - derecho;
    }
    return resultado;
  }

  private termino(): number {
    let resultado = this.factor();
    while (this.coincideOperador(['*', '/'])) {
      const operador = this.tokens[this.posicion - 1] as { type: 'operator'; value: '*' | '/' };
      const derecho = this.factor();
      if (operador.value === '/' && derecho === 0) throw new Error('División por cero');
      resultado = operador.value === '*' ? resultado * derecho : resultado / derecho;
    }
    return resultado;
  }

  private factor(): number {
    if (this.coincideOperador(['+', '-'])) {
      const operador = this.tokens[this.posicion - 1] as { type: 'operator'; value: '+' | '-' };
      const valor = this.factor();
      return operador.value === '-' ? -valor : valor;
    }
    return this.primario();
  }

  private primario(): number {
    const token = this.tokens[this.posicion];
    if (!token) throw new Error('Expresión no válida');
    if (token.type === 'number') {
      this.posicion += 1;
      return token.value;
    }
    if (token.type === 'paren' && token.value === '(') {
      this.posicion += 1;
      const valor = this.expresion();
      const cierre = this.tokens[this.posicion];
      if (!cierre || cierre.type !== 'paren' || cierre.value !== ')') {
        throw new Error('Paréntesis sin cerrar');
      }
      this.posicion += 1;
      return valor;
    }
    throw new Error('Expresión no válida');
  }

  private coincideOperador(valores: string[]): boolean {
    const token = this.tokens[this.posicion];
    if (token && token.type === 'operator' && valores.includes(token.value)) {
      this.posicion += 1;
      return true;
    }
    return false;
  }
}

function evaluarExpresion(expresion: string): number {
  const tokens = tokenizar(expresion);
  if (tokens.length === 0) throw new Error('Expresión vacía');
  const parser = new ParserAritmetico(tokens);
  const resultado = parser.parsear();
  if (!Number.isFinite(resultado)) throw new Error('Resultado no finito');
  return resultado;
}

function esExpresionValida(expresion: string): boolean {
  return /^[0-9+\-*/.() ]+$/.test(expresion);
}

export function useCalculator() {
  const expresion = ref('');
  const historial = ref<string[]>([]);
  const error = ref('');
  const memoria = ref<number | null>(null);

  const teclas = [
    ['C', '±', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  const pantalla = computed(() => expresion.value || '0');

  function agregar(valor: string): void {
    error.value = '';
    if (valor === '=') {
      calcular();
      return;
    }
    if (valor === 'C') {
      expresion.value = '';
      return;
    }
    if (valor === '⌫') {
      expresion.value = expresion.value.slice(0, -1);
      return;
    }
    if (valor === '±') {
      expresion.value = expresion.value.startsWith('-')
        ? expresion.value.slice(1)
        : expresion.value
          ? `-${expresion.value}`
          : '';
      return;
    }
    if (valor === '%') {
      expresion.value = `${expresion.value}/100`;
      return;
    }
    expresion.value += valor;
  }

  function calcular(): void {
    const limpia = expresion.value.trim();
    if (!limpia) return;
    if (!esExpresionValida(limpia)) {
      error.value = 'Expresión no válida';
      return;
    }
    try {
      const resultado = evaluarExpresion(limpia);
      historial.value = [`${limpia} = ${resultado}`, ...historial.value].slice(0, 5);
      expresion.value = String(Number(resultado.toFixed(8)));
    } catch {
      error.value = 'Expresión no válida';
    }
  }

  function teclaFisica(event: KeyboardEvent): void {
    const k = event.key;
    if (/^[0-9+\-*/.%]$/.test(k)) {
      agregar(k);
      event.preventDefault();
    } else if (k === 'Enter') {
      calcular();
      event.preventDefault();
    } else if (k === 'Backspace') {
      agregar('⌫');
      event.preventDefault();
    } else if (k === 'Escape') {
      agregar('C');
      event.preventDefault();
    }
  }

  function valorActual(): number {
    const limpia = expresion.value.trim();
    if (!limpia || !esExpresionValida(limpia)) return Number.NaN;
    try {
      return evaluarExpresion(limpia);
    } catch {
      return Number.NaN;
    }
  }

  function memoriaGuardar(): void {
    const valor = valorActual();
    if (Number.isFinite(valor)) memoria.value = valor;
  }

  function memoriaSumar(): void {
    const valor = valorActual();
    if (Number.isFinite(valor)) memoria.value = (memoria.value ?? 0) + valor;
  }

  function memoriaRestar(): void {
    const valor = valorActual();
    if (Number.isFinite(valor)) memoria.value = (memoria.value ?? 0) - valor;
  }

  function memoriaRecuperar(): void {
    if (memoria.value !== null) expresion.value += String(memoria.value);
  }

  function memoriaLimpiar(): void {
    memoria.value = null;
  }

  return {
    expresion,
    historial,
    error,
    memoria,
    teclas,
    pantalla,
    agregar,
    calcular,
    teclaFisica,
    memoriaGuardar,
    memoriaSumar,
    memoriaRestar,
    memoriaRecuperar,
    memoriaLimpiar,
  };
}