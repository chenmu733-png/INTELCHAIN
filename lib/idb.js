// Minimal IndexedDB key-value cache for offline-friendly data persistence.
const DB = 'intelchain';
const STORE = 'cache';

function open() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no-idb'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGet(key) {
  try {
    const db = await open();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
}

export async function idbSet(key, value) {
  try {
    const db = await open();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore cache write failures
  }
}

// Wrap an async fetcher with an IndexedDB fallback cache.
export async function cachedFetch(key, fetcher, ttlMs = 60_000) {
  const now = Date.now();
  const cached = await idbGet(key);
  try {
    const fresh = await fetcher();
    await idbSet(key, { value: fresh, time: now });
    return fresh;
  } catch (e) {
    if (cached) return cached.value; // serve stale on failure
    throw e;
  }
}
