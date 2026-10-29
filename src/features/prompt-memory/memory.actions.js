import * as db from '../../shared/lib/db.js';
import { ensureMemoryShape } from '../../shared/lib/db.js';
import { computeRating } from '../../shared/lib/pure.js';
import { store } from '../../shared/lib/store.js';

export const memoryActions = {
  async recordUse(id) {
    const prompt = await db.getPrompt(id);
    if (!prompt) return;
    const updated = {
      ...ensureMemoryShape(prompt),
      useCount: (prompt.useCount ?? 0) + 1,
      lastUsedAt: new Date().toISOString(),
    };
    await db.putPrompt(updated);
    await memoryActions.refresh();
  },

  async recordRating(id, faithfulness, taskCompletion) {
    const prompt = await db.getPrompt(id);
    if (!prompt) return;
    const updated = {
      ...ensureMemoryShape(prompt),
      rating: computeRating(faithfulness, taskCompletion),
    };
    await db.putPrompt(updated);
    await memoryActions.refresh();
  },

  async refresh() {
    const prompts = (await db.getAllPrompts()).map(ensureMemoryShape);
    store.set({ prompts });
  },
};