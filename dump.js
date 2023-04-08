const set = (map, key, val) => {
  if (map.get(key) === val) {
    return map;
  }
  const n = new Map(map);
  n.set(key, val);
  return n;
}

const get = (map, key, def) => {
  if (map.has(key)) {
    return map.get(key);
  }
  return def;
}

class WatchForMyA extends Map {}
class WatchForMyB extends Map {}
class WatchForMyC extends Map {}

const map = new Map();

const initialAlloocate = () => map.set("key", new WatchForMyA());
const eagerlyAllocate = () => get(map, "key", new WatchForMyB());
const lazilyAllocate = () => get(map, "key") || new WatchForMyC();

