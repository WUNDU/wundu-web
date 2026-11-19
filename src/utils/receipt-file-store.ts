"use client";

/**
 * Ficheiros dos comprovativos guardados no `IndexedDB`.
 *
 * O `localStorage` não guarda `File`s (não são serializáveis), e é isso que
 * fazia desaparecer a fila no refresh: os metadados ficavam, os ficheiros não.
 * O `IndexedDB` aceita `Blob`/`File` por arranque estruturado, por isso aqui
 * ficam os originais — é o que permite retomar a fila (mesmo os que ainda não
 * tinham sido enviados) depois de recarregar a página.
 *
 * As chaves são prefixadas com a chave da fila do utilizador, para os
 * comprovativos não se misturarem entre contas no mesmo browser.
 */

const DB_NAME = "wundu-receipt-files";
const STORE_NAME = "files";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexeddb"));
    request.onblocked = () => reject(new Error("indexeddb"));
  });
}

/** Corre uma operação de escrita e fecha a base. */
async function write(
  operation: (store: IDBObjectStore) => IDBRequest,
): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      operation(tx.objectStore(STORE_NAME));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("indexeddb"));
      tx.onabort = () => reject(tx.error ?? new Error("indexeddb"));
    });
  } finally {
    db.close();
  }
}

/** Guarda o original de um comprovativo (falha em silêncio: é só uma rede de segurança). */
export async function saveReceiptFile(key: string, file: File): Promise<void> {
  try {
    await write((store) => store.put(file, key));
  } catch {
    // modo privado / cota: a fila continua, apenas não retoma no refresh
  }
}

/** Devolve o original guardado, ou `null` se já não existir. */
export async function loadReceiptFile(key: string): Promise<File | null> {
  try {
    const db = await openDb();
    try {
      const result = await new Promise<File | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(key);
        request.onsuccess = () =>
          resolve(request.result instanceof File ? request.result : null);
        request.onerror = () =>
          reject(request.error ?? new Error("indexeddb"));
      });
      return result;
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

/** Apaga o original (guardado/rejeitado/descartado — já não faz falta). */
export async function deleteReceiptFile(key: string): Promise<void> {
  try {
    await write((store) => store.delete(key));
  } catch {
    // nada a fazer: fica só espaço perdido na base local
  }
}
