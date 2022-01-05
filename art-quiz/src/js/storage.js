const storage = localStorage;
export const storageSet = storage.setItem.bind(storage);
export const storageGet = storage.getItem.bind(storage);