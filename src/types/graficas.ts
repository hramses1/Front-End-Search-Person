/**
 * Tipos compartidos de las gráficas.
 *
 * Viven fuera del componente porque `<script setup>` no admite exports, y
 * tanto quien dibuja como quien prepara los datos necesitan la misma forma.
 */
export interface PuntoDia {
  /** Fecha ISO, solo la parte del día. */
  fecha: string;
  valor: number;
}
