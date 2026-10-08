/*
 * PIN dos professores, guardado no navegador de cada computador da estação.
 * O professor digita uma vez de manhã; fica salvo até limpar o navegador.
 */

const CHAVE = "conectar-pin";

export function lerPin() {
  try {
    return localStorage.getItem(CHAVE) ?? "";
  } catch {
    return "";
  }
}

export function guardarPin(pin: string) {
  try {
    localStorage.setItem(CHAVE, pin);
  } catch {
    // Navegador sem armazenamento: o PIN vale só enquanto a página estiver aberta.
  }
}

export function comPin(pin: string, init: RequestInit = {}): RequestInit {
  return { ...init, headers: { ...init.headers, "Content-Type": "application/json", "x-conectar-pin": pin } };
}
