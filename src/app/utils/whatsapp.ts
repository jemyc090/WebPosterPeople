// ─── WhatsApp config ──────────────────────────────────────────────────────────
// Cambia el número y la plantilla aquí para actualizar todos los botones a la vez.

export const WA_NUMBER = "5529599392";

/**
 * Construye el mensaje de WhatsApp.
 * @param serviceName  Nombre del servicio o categoría a cotizar.
 * @param extra        Texto adicional opcional que se añade antes del cierre.
 */
export function buildWAMessage(serviceName: string, extra?: string): string {
  const body = extra ? `${extra} ` : "";
  return `Hola, me gustaría cotizar el servicio de *${serviceName}*, ${body}muchas gracias`;
}

/**
 * Abre WhatsApp con el número configurado y un mensaje prellenado.
 * @param serviceName  Nombre del servicio o categoría.
 * @param extra        Texto opcional entre el nombre del servicio y el cierre.
 */
export function openWhatsApp(serviceName: string, extra?: string): void {
  const msg = encodeURIComponent(buildWAMessage(serviceName, extra));
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
}
