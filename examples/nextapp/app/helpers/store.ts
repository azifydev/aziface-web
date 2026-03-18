export const storeString = (key: string, value: string) => {
  try {
    return localStorage.setItem(key, value);
  } catch (e) {
    return console.log(e);
  }
};

export const getString = (key: string) => {
  try {
    const result = localStorage.getItem(key);
    return result;
  } catch (e) {
    return console.log(e);
  }
};

export const storeClearAll = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.log(e);
  }
};
