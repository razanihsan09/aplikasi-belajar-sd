import { useState } from 'react';

const KEYS = ['A', 'B', 'C', 'D', 'E'];

// Efek suara gamifikasi gratis dari repositori Google
const SOUND_CORRECT = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
const SOUND_WRONG = 'https://actions.google.com/sounds/v1/cartoon/slip.ogg';

export default function QuestionCard({ question, isLast, onAnswer, onNext }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correctIndex;

  const playSound = (correct) => {
    const audio = new Audio(correct ? SOUND_CORRECT : SOUND_WRONG);
    audio.volume = 0.5;
    audio.play().catch(() => { /* Abaikan jika browser memblokir autoplay */ });
  };

  const choose = (index) => {
    if (answered) return;
    const correct = index === question.correctIndex;
    setSelected(index);
    onAnswer(correct);
    playSound(correct); // Mainkan suara saat dipilih
  };

  const optionClass = (index) => {
    if (!answered) return 'option';
    if (index === question.correctIndex) return 'option is-correct';
    if (index === selected) return 'option is-wrong';
    return 'option is-dim';
  };

  return (
    <section className="qcard">
      {question.passage && <blockquote className="passage">{question.passage}</blockquote>}
      <h2 className="prompt">{question.prompt}</h2>

      <ul className="options">
        {question.options.map((text, index) => (
          <li key={index}>
            <button
              type="button"
              className={optionClass(index)}
              onClick={() => choose(index)}
              disabled={answered}
            >
              <span className="key" aria-hidden="true">{KEYS[index]}</span>
              <span className="grow">{text}</span>
              {/* Tambahkan ikon centang atau silang setelah dijawab */}
              {answered && index === question.correctIndex && <span aria-hidden="true">✅</span>}
              {answered && index === selected && !isCorrect && <span aria-hidden="true">❌</span>}
            </button>
          </li>
        ))}
      </ul>

      {answered && (
        <div className={`feedback ${isCorrect ? 'ok' : 'bad'}`} role="status" aria-live="polite">
          <h3>{isCorrect ? '🌟 Hebat, jawabanmu benar!' : 'Oops! Belum tepat.'}</h3>
          {!isCorrect && (
            <p>
              Jawaban yang benar adalah: <strong>{question.options[question.correctIndex]}</strong>
            </p>
          )}
          <p>{question.explanation}</p>
          <button type="button" className="btn" onClick={onNext} autoFocus>
            {isLast ? 'Selesai' : 'Lanjut'}
          </button>
        </div>
      )}
    </section>
  );
}