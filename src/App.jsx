import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Confetti from 'react-confetti'; // TAMBAHKAN IMPORT INI
import { LESSONS_DATA } from './data/lessons';
import { db, getStats, saveLessonResult, requestPersistentStorage } from './db/db';
import { getActiveStreak } from './utils/gamification';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import LessonList from './components/LessonList';

export default function App() {
  const stats = useLiveQuery(getStats, [], null);
  const rows = useLiveQuery(() => db.lessonProgress.toArray(), [], null);

  const progress = useMemo(
    () => Object.fromEntries((rows ?? []).map((row) => [row.lessonId, row])),
    [rows],
  );

  const [session, setSession] = useState(null); 
  const [result, setResult] = useState(null);

  // Menyimpan dimensi layar untuk Confetti
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    requestPersistentStorage();
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!stats || !rows) {
    return (
      <main className="app center">
        <p>Menyiapkan pelajaran…</p>
      </main>
    );
  }

  const streak = getActiveStreak(stats);

  const startLesson = (lesson) => {
    setResult(null);
    setSession({ lesson, index: 0, correct: 0 });
  };

  const quitLesson = () => {
    if (window.confirm('Keluar dari pelajaran? Jawabanmu di modul ini belum disimpan.')) {
      setSession(null);
    }
  };

  const handleAnswer = (isCorrect) => {
    setSession((s) => ({ ...s, correct: s.correct + (isCorrect ? 1 : 0) }));
  };

  const handleNext = async () => {
    const { lesson, index, correct } = session;
    const total = lesson.questions.length;

    if (index + 1 < total) {
      setSession({ ...session, index: index + 1 });
      return;
    }

    const saved = await saveLessonResult({
      lessonId: lesson.id,
      correct,
      total,
      xpReward: lesson.xpReward,
    });
    setResult({ lesson, correct, total, ...saved });
    setSession(null);
  };

  if (session) {
    const { lesson, index } = session;
    const total = lesson.questions.length;
    return (
      <main className="app">
        <div className="lesson-top">
          <button type="button" className="close" onClick={quitLesson} aria-label="Keluar dari pelajaran">
            ✕
          </button>
          <div className="grow">
            <ProgressBar totalXP={stats.totalXP} streak={streak} current={index} total={total} />
          </div>
        </div>
        <QuestionCard
          key={lesson.questions[index].id}
          question={lesson.questions[index]}
          isLast={index + 1 === total}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </main>
    );
  }

  if (result) {
    const { lesson, correct, total, passed, xpGained } = result;
    return (
      <main className="app center result">
        {/* RENDER CONFETTI JIKA LULUS */}
        {passed && (
          <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={400} 
            gravity={0.15}
          />
        )}
        
        <div className="result-emoji" aria-hidden="true">{passed ? '🏆' : '💪'}</div>
        <h1>{passed ? 'Modul selesai!' : 'Ayo coba lagi!'}</h1>
        <p className="result-score">
          {correct} dari {total} soal benar
        </p>
        <p>
          {passed
            ? xpGained > 0
              ? `Kamu mendapat +${xpGained} XP dan membuka modul berikutnya.`
              : 'Kamu sudah pernah lulus modul ini, jadi tidak ada XP tambahan.'
            : 'Kamu butuh lebih banyak jawaban benar untuk lulus. Baca penjelasannya lalu coba lagi.'}
        </p>
        <button type="button" className="btn" onClick={() => setResult(null)}>
          Kembali ke peta
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => startLesson(lesson)}>
          Ulangi modul
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <ProgressBar totalXP={stats.totalXP} streak={streak} />
      <div className="home">
        <LessonList lessons={LESSONS_DATA} progress={progress} onSelect={startLesson} />
      </div>
    </main>
  );
}