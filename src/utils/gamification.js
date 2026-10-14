// Aturan permainan dikumpulkan di satu tempat supaya mudah diubah.

export const LEVEL_XP = 50; // XP yang dibutuhkan untuk naik satu level
export const PASS_RATIO = 0.6; // minimal 60% soal benar agar modul dianggap lulus

const LEVEL_TITLES = ['Pemula', 'Penjelajah', 'Pelaut Cilik', 'Juara Kampung', 'Bintang Sekolah', 'Pahlawan Ilmu'];

export const isPassed = (correct, total) => total > 0 && correct / total >= PASS_RATIO;

export function getLevelInfo(totalXP = 0) {
  const level = Math.floor(totalXP / LEVEL_XP) + 1;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xpInLevel: totalXP % LEVEL_XP,
  };
}

// Tanggal lokal perangkat (YYYY-MM-DD), tidak bergantung pada internet.
export function toDateKey(date = new Date()) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

// Streak hanya dihitung bila anak belajar hari ini atau kemarin.
export function getActiveStreak(stats) {
  if (!stats?.lastActiveDate) return 0;
  const today = toDateKey();
  const yesterday = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  return stats.lastActiveDate === today || stats.lastActiveDate === yesterday ? stats.streak : 0;
}
