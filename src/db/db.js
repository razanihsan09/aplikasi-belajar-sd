import Dexie from 'dexie';
import { isPassed, toDateKey } from '../utils/gamification';

export const db = new Dexie('BelajarCeriaDB');

db.version(1).stores({
  lessonProgress: 'lessonId, completed, updatedAt', 
  userStats: 'id', 
});

const STATS_ID = 'me';

export const DEFAULT_STATS = { id: STATS_ID, totalXP: 0, streak: 0, lastActiveDate: null };

export async function getStats() {
  return (await db.userStats.get(STATS_ID)) ?? DEFAULT_STATS;
}

export async function saveLessonResult({ lessonId, correct, total, xpReward }) {
  return db.transaction('rw', db.lessonProgress, db.userStats, async () => {
    const prev = await db.lessonProgress.get(lessonId);
    const stats = await getStats();

    const passed = isPassed(correct, total);
    const firstPass = passed && !prev?.completed;
    const xpGained = firstPass ? xpReward : 0;

    await db.lessonProgress.put({
      lessonId,
      completed: Boolean(prev?.completed) || passed,
      bestScore: Math.max(prev?.bestScore ?? 0, correct),
      total,
      attempts: (prev?.attempts ?? 0) + 1,
      updatedAt: Date.now(),
    });

    const today = toDateKey();
    const yesterday = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
    let streak = stats.streak;
    if (stats.lastActiveDate !== today) {
      streak = stats.lastActiveDate === yesterday ? stats.streak + 1 : 1;
    }

    const nextStats = { ...stats, totalXP: stats.totalXP + xpGained, streak, lastActiveDate: today };
    await db.userStats.put(nextStats);

    return { passed, firstPass, xpGained, stats: nextStats };
  });
}

export async function resetAllProgress() {
  await db.transaction('rw', db.lessonProgress, db.userStats, async () => {
    await db.lessonProgress.clear();
    await db.userStats.clear();
  });
}

export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    
  }
}
