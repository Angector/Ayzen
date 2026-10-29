import * as db from '../../shared/lib/db.js';
import { ensureMemoryShape } from '../../shared/lib/db.js';
import { store } from '../../shared/lib/store.js';

export const libraryStore = {
  async refresh() {
    const prompts = (await db.getAllPrompts()).map(ensureMemoryShape);
    store.set({ prompts });
  },

  async deletePrompt(id) {
    await db.deletePrompt(id);
    await libraryStore.refresh();
  },

  async savePrompt(data) {
    await db.putPrompt(data);
    await libraryStore.refresh();
  },

  async recordCopy(id) {
    const prompt = await db.getPrompt(id);
    if (!prompt) return;
    await db.putPrompt({
      ...ensureMemoryShape(prompt),
      useCount: (prompt.useCount ?? 0) + 1,
      lastUsedAt: new Date().toISOString(),
    });
    await libraryStore.refresh();
  },
};