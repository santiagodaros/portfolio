// Número en palabras para textos corridos ("seis certificaciones"); pasa a cifras desde el 13.
const words = {
  es: ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
} as const;

export function numberWord(n: number, lang: 'es' | 'en'): string {
  return words[lang][n] ?? String(n);
}
