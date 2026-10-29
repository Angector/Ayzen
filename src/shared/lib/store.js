const listeners = new Set();

let state = {
  prompts: [],
  filter: { q: '', category: '', model: '' },
  view: 'library',
  editingId: null,
  loading: true,
  projects: [],
  tasksByProject: {},
  activeProjectId: null,
  events: [],
};

export const store = {
  get: () => state,
  snap: () => ({
    ...state,
    filter: { ...state.filter },
    tasksByProject: { ...state.tasksByProject },
  }),

  set(patch) {
    const prev = state;
    state = {
      ...state,
      ...patch,
      filter: patch.filter ? { ...state.filter, ...patch.filter } : state.filter,
    };
    listeners.forEach(fn => fn(state, prev));
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};