import { Fragment } from 'react';
import { SUBJECTS } from '../data/lessons';

export default function LessonList({ lessons, progress, onSelect }) {
  return (
    <ol className="path">
      {lessons.map((lesson, i) => {
        const row = progress[lesson.id];
        const prevDone = i === 0 || progress[lessons[i - 1].id]?.completed;
        const status = row?.completed ? 'done' : prevDone ? 'current' : 'locked';
        const subject = SUBJECTS[lesson.subject];
        const newSubject = i === 0 || lessons[i - 1].subject !== lesson.subject;
        
        // Jarak zig-zag diperbesar menjadi 60px agar garis miring terlihat lebih jelas
        const shift = Math.round(Math.sin(i * 1.1) * 60); 

        const info =
          status === 'done'
            ? `Terbaik ${row.bestScore}/${row.total}`
            : status === 'locked'
              ? 'Terkunci'
              : `+${lesson.xpReward} XP`;

        return (
          <Fragment key={lesson.id}>
            {newSubject && (
              <li className="subject-title" style={{ '--accent': subject?.color }}>
                <h2>{subject?.label}</h2>
              </li>
            )}
            <li
              className={`stop ${status}`}
              style={{ '--accent': subject?.color, transform: `translateX(${shift}px)` }}
            >
              <button
                type="button"
                className="node"
                disabled={status === 'locked'}
                onClick={() => onSelect(lesson)}
                aria-label={`${lesson.title}. ${info}`}
              >
                <span aria-hidden="true" style={{ fontSize: '38px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>
                  {status === 'locked' ? '🔒' : lesson.icon}
                </span>
                {status === 'done' && <span className="check" aria-hidden="true">✓</span>}
              </button>
              <strong className="stop-title">{lesson.title}</strong>
              <span className="stop-sub">{lesson.subtitle}</span>
              <span className="stop-info">{info}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}