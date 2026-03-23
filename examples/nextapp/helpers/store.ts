'use client';

export const storeString = (key: string, value: string) => {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getString = (key: string) => {
  try {
    const result = localStorage.getItem(key);
    return result;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const storeClearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
