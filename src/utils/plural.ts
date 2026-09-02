/**
 * Concuerda el sustantivo con la cantidad.
 *
 * Los textos llevaban el plural fijo, asi que en cuanto habia un solo
 * elemento se leia "1 consultas" o "este plan lo usan 1 usuarios".
 */
export const plural = (n: number, singular: string, formaPlural?: string): string =>
  `${n} ${n === 1 ? singular : (formaPlural ?? `${singular}s`)}`;
