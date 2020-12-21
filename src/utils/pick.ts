export const pick = (object: any, keys: string[]) => keys.reduce(
  (obj: any, key: string) => { // { sortBy: 2, limit: 5, head: 'man' }, ['sortBy', 'limit', 'page']
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {}
);
