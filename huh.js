const get = (map, key, def) => {
  if (map.has(key)) {
    return map.get(key);
  }
  return def;
}

(() => {
  class WatchForMyA extends Map {}
  // class WatchForMyB extends Map {}
  class WatchForMyC extends Map {}

  const map = new Map();
  map.set("key", new WatchForMyA());

  get(map, "key");
  get(map, "key2");
  get(map, "key3");
  get(map, "key4");

  get(map, "key", new WatchForMyC());
})();
