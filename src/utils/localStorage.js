// src/utils/localStorage.js

export const getLocalStorage = (key, defaultValue = []) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    // If no value, set the default value in localStorage and return it
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    // If error, set the default value in localStorage and return it
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};