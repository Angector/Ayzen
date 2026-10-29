import { store } from '../shared/lib/store.js';

const VIEWS = {
  library: 'library-view',
  composer: 'composer-view',
  projects: 'cockpit-view',
  'project-room': 'cockpit-room',
  knowledge: 'knowledge-view',
  lab: 'creativity-lab',
  insights: 'insights-view',
};

export function mountRouter(root) {
  store.subscribe(({ view }) => {
    const tag = VIEWS[view] ?? 'library-view';
    if (root.firstElementChild?.tagName.toLowerCase() !== tag) {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          root.innerHTML = `<${tag}></${tag}>`;
        });
      } else {
        root.innerHTML = `<${tag}></${tag}>`;
      }
    }
  });
}

export function navigate(view) {
  store.set({ view });
}