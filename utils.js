// utils.js

// LocalStorage'a veri kaydet
export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// LocalStorage'dan veri al
export function getItem(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

// LocalStorage'dan veri sil
export function removeItem(key) {
  localStorage.removeItem(key);
}

// LocalStorage'daki tüm verileri temizle
export function clearStorage() {
  localStorage.clear();
}
