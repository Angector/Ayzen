const plugins = new Map();

export function registerPlugin(id, plugin) {
  if (plugins.has(id)) throw new Error(`Plugin "${id}" already registered`);
  plugins.set(id, plugin);
}

export function getPlugin(id) { return plugins.get(id); }
export function getAllPlugins() { return [...plugins.values()]; }