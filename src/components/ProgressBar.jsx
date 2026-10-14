import { LEVEL_XP, getLevelInfo } from '../utils/gamification';

export default function ProgressBar({ totalXP = 0, streak = 0, current = 0, total }) {
  const lessonMode = typeof total === 'number';
  const { level, title, xpInLevel } = getLevelInfo(totalXP);

  const percent = lessonMode ? (current / total) * 100 : (xpInLevel / LEVEL_XP) * 100;
  const label = lessonMode
    ? `Soal ${Math.min(current + 1, total)} dari ${total}`
    : `${xpInLevel} dari ${LEVEL_XP} XP menuju Level ${level + 1}`;

  return (
    <div className="stats">
      <div className="stats-row">
        <span className="chip" title="Hari belajar berturut-turut">🔥 {streak} hari</span>
        <span className="chip" title="Total poin pengalaman">⭐ {totalXP} XP</span>
        <span className="chip">Level {level} {title}</span>
      </div>
      <div
        className="bar"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="bar-label">{label}</p>
    </div>
  );
}
