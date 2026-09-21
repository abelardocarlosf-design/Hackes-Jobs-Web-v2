/**
 * `node:sqlite` existe desde Node 22, pero el proyecto usa @types/node@20, que
 * todavía no lo declara. Aquí se tipa lo mínimo que necesita
 * `migrar-cat-items.ts` para leer la base SQLite antigua.
 *
 * Se puede borrar este archivo el día que se suba @types/node.
 */
declare module 'node:sqlite' {
  interface SentenciaPreparada {
    all(...parametros: unknown[]): unknown[];
    get(...parametros: unknown[]): unknown;
    run(...parametros: unknown[]): { changes: number; lastInsertRowid: number };
  }

  export class DatabaseSync {
    constructor(ruta: string, opciones?: { readOnly?: boolean });
    prepare(sql: string): SentenciaPreparada;
    close(): void;
  }
}
