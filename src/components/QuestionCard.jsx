import { useState } from 'react';

const KEYS = ['A', 'B', 'C', 'D', 'E'];
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function QuestionCard({ question, isLast, onAnswer, onNext }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correctIndex;

  const choose = (index) => {
    if (answered) return;
    setSelected(index);
    onAnswer(index === question.correctIndex);
  };

  const speak = () => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    const text = [question.passage, question.prompt].filter(Boolean).join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const optionClass = (index) => {
    if (!answered) return 'option';
    if (index === question.correctIndex) return 'option is-correct';
    if (index === selected) return 'option is-wrong';
    return 'option is-dim';
  };

  return (
    <section className="qcard">
      {canSpeak && (
        <button type="button" className="speak" onClick={speak}>
          🔊 Dengarkan soal
        </button>
      )}

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
              <span>{text}</span>
            </button>
          </li>
        ))}
      </ul>

      {answered && (
        <div className={`feedback ${isCorrect ? 'ok' : 'bad'}`} role="status" aria-live="polite">
          <h3>{isCorrect ? '✅ Hebat, jawabanmu benar!' : '❌ Belum tepat, tidak apa-apa.'}</h3>
          {!isCorrect && (
            <p>
              Jawaban yang benar: <strong>{question.options[question.correctIndex]}</strong>
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
