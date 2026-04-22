import { useState, useEffect } from 'react';
import { LEARNING_AREAS } from '../data/content';
import { useStore } from '../store/useStore';
import { HTTPVisualization } from '../visualizations/HTTPVisualization';
import { NeuralNetworkVisualization } from '../visualizations/NeuralNetworkVisualization';
import { BinarySearchVisualization } from '../visualizations/BinarySearchVisualization';
import { AreaIcon, BoltIcon } from '../components/AreaIcon';
import { FlameIcon } from '../components/FlameIcon';

function Visualization({ vizType, step }: { vizType: string; step: number }) {
  if (vizType === 'neural') return <NeuralNetworkVisualization step={step} />;
  if (vizType === 'bst') return <BinarySearchVisualization step={step} />;
  return <HTTPVisualization step={step} />;
}

// ── Quiz option button ────────────────────────────────────────────────────────

function OptionButton({
  label, text, isSelected, isRevealed, isCorrect, onClick,
}: {
  label: string; text: string;
  isSelected: boolean; isRevealed: boolean; isCorrect: boolean;
  onClick: () => void;
}) {
  let bg = 'var(--surface)';
  let border = 'var(--border)';
  let labelBg = 'var(--border)';
  let labelColor = 'var(--text-muted)';
  let opacity = 1;

  if (isRevealed) {
    if (isCorrect) {
      bg = 'rgba(34,197,94,0.08)';
      border = 'rgba(34,197,94,0.5)';
      labelBg = 'rgba(34,197,94,0.15)';
      labelColor = 'var(--green)';
    } else if (isSelected) {
      bg = 'rgba(229,62,62,0.08)';
      border = 'rgba(229,62,62,0.5)';
      labelBg = 'rgba(229,62,62,0.15)';
      labelColor = 'var(--accent)';
    } else {
      opacity = 0.4;
    }
  } else if (isSelected) {
    bg = 'var(--accent-dim)';
    border = 'var(--accent)';
    labelBg = 'var(--accent)';
    labelColor = 'white';
  }

  return (
    <button
      onClick={onClick}
      disabled={isRevealed}
      style={{
        all: 'unset', cursor: isRevealed ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 14px', borderRadius: '10px',
        background: bg, border: `1.5px solid ${border}`,
        transition: 'all 0.2s ease', opacity,
        width: '100%', boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
        background: labelBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: '700',
        color: labelColor, transition: 'all 0.2s',
      }}>
        {label}
      </div>
      <span style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--text)', flex: 1, textAlign: 'left' }}>
        {text}
      </span>
      {isRevealed && isCorrect && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill="rgba(34,197,94,0.2)" />
          <path d="M4.5 8.5L7 11L11.5 5" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {isRevealed && isSelected && !isCorrect && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill="rgba(229,62,62,0.2)" />
          <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}

// ── Main Lesson component ─────────────────────────────────────────────────────

export function Lesson() {
  const { currentLessonId, completeLesson, setScreen, lessonDates, streak } = useStore();

  // Reading lesson state
  const [step, setStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizRevealed, setQuizRevealed] = useState<boolean[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Streak celebration state
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [streakCelebrationCount, setStreakCelebrationCount] = useState(1);

  const lesson = LEARNING_AREAS.flatMap(a => a.lessons).find(l => l.id === currentLessonId);
  const area   = LEARNING_AREAS.find(a => a.id === lesson?.areaId);

  useEffect(() => {
    setStep(0);
    setShowCompletion(false);
    setCompleting(false);
    setQuizAnswers([]);
    setQuizRevealed([]);
    setShowQuizResults(false);
    setShowStreakCelebration(false);
  }, [currentLessonId]);

  if (!lesson || !area) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Lesson not found.</div>
        <button className="btn-ghost" onClick={() => setScreen('dashboard')}>Back to dashboard</button>
      </div>
    );
  }

  const isQuiz     = lesson.type === 'quiz';
  const questions  = lesson.questions ?? [];
  const totalSteps = isQuiz ? questions.length : lesson.steps.length;
  const isLastStep = step === totalSteps;

  // ── Streak celebration screen ───────────────────────────────────────────────
  if (showStreakCelebration) {
    const message =
      streakCelebrationCount === 1 ? "You've started a new streak. Come back tomorrow!" :
      streakCelebrationCount < 7   ? "You're building a habit. Keep it up!" :
      streakCelebrationCount < 30  ? "Consistency is your superpower." :
                                     "Legendary dedication. Nothing can stop you.";

    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div className="anim-glow-expand" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 65% 55% at 50% 48%, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.06) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Igniting flame */}
          <div className="anim-flame-ignite" style={{ display: 'inline-block', marginBottom: '18px' }}>
            <FlameIcon size={96} animated />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '6px' }}>
            STREAK
          </div>

          <div className="anim-streak-pop" style={{
            fontFamily: 'var(--font-body)', fontSize: '80px', fontWeight: '700',
            lineHeight: 1, marginBottom: '6px',
            background: 'linear-gradient(135deg, #FBBF24 0%, #F97316 50%, #E53E3E 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {streakCelebrationCount}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: '22px' }}>
            DAY STREAK
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '220px', margin: '0 auto 44px', lineHeight: '1.6' }}>
            {message}
          </div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '5px', height: '5px', borderRadius: '50%',
              background: i % 3 === 0 ? '#FBBF24' : i % 3 === 1 ? '#F97316' : '#E53E3E',
              top: `${12 + (i * 11) % 76}%`,
              left: `${6 + (i * 13) % 88}%`,
              animation: `float ${1.6 + i * 0.25}s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
              opacity: 0.5,
            }} />
          ))}

          <div className="anim-fade-delayed" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '280px', margin: '0 auto' }}>
            <button
              className="btn-primary"
              disabled={completing}
              onClick={async () => {
                setCompleting(true);
                await completeLesson(lesson.id, lesson.xp);
                setCompleting(false);
              }}
              style={{ padding: '14px', fontSize: '15px' }}
            >
              {completing ? 'Saving...' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Completion screen (shared) ──────────────────────────────────────────────
  if (showCompletion) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 40px) 20px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="anim-xp-burst" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto 22px',
            background: 'var(--accent-dim)', border: '2px solid rgba(229,62,62,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px var(--accent-glow)',
          }}>
            <BoltIcon size={38} color="var(--accent)" strokeWidth={1.4} />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>
            {isQuiz ? 'QUIZ COMPLETE' : 'LESSON COMPLETE'}
          </div>

          <div className="text-gradient" style={{ fontFamily: 'var(--font-body)', fontSize: '52px', fontWeight: '700', lineHeight: '1', marginBottom: '10px' }}>
            +{lesson.xp}<span style={{ fontSize: '22px' }}>XP</span>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px', fontFamily: 'var(--font-mono)' }}>
            {lesson.title}
          </div>

          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '6px', height: '6px', borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--accent)' : 'var(--amber)',
              top: `${15 + Math.random() * 70}%`,
              left: `${5 + Math.random() * 90}%`,
              animation: `float ${2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0.6,
            }} />
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
            <button
              className="btn-primary"
              disabled={completing}
              style={{ padding: '14px', fontSize: '15px' }}
              onClick={() => {
                const today     = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
                const lastDate  = lessonDates.at(-1) ?? null;
                const isFirstToday = !lessonDates.includes(today);

                if (isFirstToday) {
                  const resolvedStreak = (lastDate === today || lastDate === yesterday) ? streak : 0;
                  const newStreakCount = lastDate === yesterday ? resolvedStreak + 1 : 1;
                  setStreakCelebrationCount(newStreakCount);
                  setShowStreakCelebration(true);
                } else {
                  setCompleting(true);
                  completeLesson(lesson.id, lesson.xp).finally(() => setCompleting(false));
                }
              }}
            >
              {completing ? 'Saving...' : 'Continue →'}
            </button>
            <button className="btn-ghost" onClick={() => setScreen('dashboard')}>
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz results screen ─────────────────────────────────────────────────────
  if (isQuiz && showQuizResults) {
    const correctCount = questions.filter((q, i) => quizAnswers[i] === q.correct).length;
    const total        = questions.length;
    const pct          = Math.round((correctCount / total) * 100);
    const shouldRepeat = correctCount < Math.ceil(total / 2);

    function handleRepeat() {
      setStep(0);
      setShowQuizResults(false);
      setQuizAnswers([]);
      setQuizRevealed([]);
    }

    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: shouldRepeat
            ? 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(229,62,62,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 50% 40% at 50% 50%, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '340px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Score ring */}
          <div style={{
            width: '110px', height: '110px', borderRadius: '50%', margin: '0 auto 24px',
            background: shouldRepeat ? 'rgba(229,62,62,0.1)' : 'rgba(34,197,94,0.1)',
            border: `3px solid ${shouldRepeat ? 'rgba(229,62,62,0.4)' : 'rgba(34,197,94,0.4)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: shouldRepeat ? '0 0 30px rgba(229,62,62,0.15)' : '0 0 30px rgba(34,197,94,0.15)',
          }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '34px', fontWeight: '700', lineHeight: 1,
              color: shouldRepeat ? 'var(--accent)' : 'var(--green)',
            }}>
              {correctCount}/{total}
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
              CORRECT
            </div>
          </div>

          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>
            QUIZ RESULTS
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            {pct}% correct
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '28px' }}>
            {shouldRepeat
              ? 'A few concepts to revisit — consider repeating the lesson for a better foundation.'
              : 'Great work! You\'ve got a solid grasp of this material.'}
          </div>

          {shouldRepeat && (
            <div style={{
              padding: '12px 16px', marginBottom: '20px',
              background: 'rgba(229,62,62,0.07)', border: '1px solid rgba(229,62,62,0.2)',
              borderRadius: '10px', textAlign: 'left',
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '5px' }}>
                SUGGESTION
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                You got {correctCount} of {total} right. Repeating the reading lessons first might help.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn-primary" onClick={() => setShowCompletion(true)} style={{ padding: '14px', fontSize: '15px' }}>
              {shouldRepeat ? 'Finish anyway →' : `Claim ${lesson.xp} XP →`}
            </button>
            {shouldRepeat && (
              <button className="btn-ghost" onClick={handleRepeat}>
                Repeat quiz
              </button>
            )}
            <button className="btn-ghost" style={{ fontSize: '12px' }} onClick={() => setScreen('dashboard')}>
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main lesson / quiz UI ───────────────────────────────────────────────────
  const currentReadingStep = lesson.steps[step - 1];
  const currentQuestion    = isQuiz && step > 0 ? questions[step - 1] : null;
  const questionAnswered   = isQuiz && step > 0 ? quizRevealed[step - 1] === true : true;

  function handleNext() {
    if (isQuiz) {
      if (step === 0) { setStep(1); return; }
      if (!questionAnswered) return;
      if (isLastStep) { setShowQuizResults(true); }
      else { setStep(s => s + 1); }
    } else {
      if (isLastStep) { setShowCompletion(true); }
      else { setStep(s => s + 1); }
    }
  }

  function handleQuizSelect(qIdx: number, answerIdx: number) {
    if (quizRevealed[qIdx]) return;
    setQuizAnswers(prev => { const n = [...prev]; n[qIdx] = answerIdx; return n; });
    setQuizRevealed(prev => { const n = [...prev]; n[qIdx] = true; return n; });
  }

  // CTA label
  let ctaLabel: string;
  if (step === 0) {
    ctaLabel = isQuiz ? 'Start quiz →' : 'Start lesson →';
  } else if (isQuiz) {
    if (!questionAnswered) ctaLabel = 'Select an answer';
    else if (isLastStep) ctaLabel = 'See results →';
    else ctaLabel = 'Next question →';
  } else {
    ctaLabel = isLastStep ? 'Finish lesson ✓' : `Next: ${lesson.steps[step]?.title ?? ''} →`;
  }

  const progressItems = isQuiz ? questions : lesson.steps;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '22px 0 18px' }}>
          <button
            onClick={() => setScreen('dashboard')}
            style={{
              all: 'unset', cursor: 'pointer',
              width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
              background: 'var(--card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Step/question progress bar */}
          <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
            {progressItems.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: i < step ? 'var(--green)' : i === step - 1 ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.4s ease',
                boxShadow: i === step - 1 ? '0 0 6px var(--accent-glow)' : 'none',
              }} />
            ))}
          </div>

          <div className="badge-xp" style={{ flexShrink: 0 }}>
            {isQuiz ? '📝' : ''} +{lesson.xp} XP
          </div>
        </div>

        {/* Title + area + intro */}
        <div className="anim-slide-up" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <AreaIcon name={area.icon} size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {area.name}
            </span>
            {isQuiz && (
              <>
                <span style={{ fontSize: '11px', color: 'var(--border-light)' }}>·</span>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>QUIZ</span>
              </>
            )}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700',
            letterSpacing: '-0.5px', lineHeight: '1.2', marginBottom: '10px',
          }}>
            {lesson.title}
          </h1>
          {step === 0 && (
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              {lesson.intro}
            </p>
          )}
        </div>

        {/* Quiz question UI */}
        {isQuiz && currentQuestion && (
          <div className="anim-slide-up delay-1" style={{ marginBottom: '16px' }}>
            {/* Question card */}
            <div className="card" style={{ padding: '20px', marginBottom: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0,
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'white',
                }}>
                  {step}
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  QUESTION {step} OF {questions.length}
                </div>
              </div>

              <p style={{
                fontSize: '15px', fontWeight: '600', lineHeight: '1.5',
                color: 'var(--text)', marginBottom: '16px',
                fontFamily: 'var(--font-display)',
              }}>
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentQuestion.options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    label={String.fromCharCode(65 + i)}
                    text={opt}
                    isSelected={quizAnswers[step - 1] === i}
                    isRevealed={quizRevealed[step - 1] === true}
                    isCorrect={i === currentQuestion.correct}
                    onClick={() => handleQuizSelect(step - 1, i)}
                  />
                ))}
              </div>

              {/* Explanation */}
              {quizRevealed[step - 1] && (
                <div style={{
                  marginTop: '14px', padding: '12px 14px',
                  background: quizAnswers[step - 1] === currentQuestion.correct
                    ? 'rgba(34,197,94,0.06)'
                    : 'rgba(229,62,62,0.06)',
                  border: `1px solid ${quizAnswers[step - 1] === currentQuestion.correct
                    ? 'rgba(34,197,94,0.2)'
                    : 'rgba(229,62,62,0.2)'}`,
                  borderRadius: '10px',
                }}>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: '5px',
                    color: quizAnswers[step - 1] === currentQuestion.correct ? 'var(--green)' : 'var(--accent)',
                  }}>
                    {quizAnswers[step - 1] === currentQuestion.correct ? 'CORRECT' : 'INCORRECT'}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reading lesson visualization (only for non-quiz lessons) */}
        {!isQuiz && (
          <div className="card anim-slide-up delay-1" style={{
            padding: '20px', marginBottom: '16px',
            background: 'var(--surface)',
            minHeight: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderLeft: '2px solid var(--accent)',
          }}>
            {lesson.vizType && <Visualization vizType={lesson.vizType} step={step} />}
          </div>
        )}

        {/* Reading step content */}
        {!isQuiz && currentReadingStep && (
          <div className="card anim-slide-up" style={{ padding: '18px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0,
                background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'white',
              }}>
                {step}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '14px' }}>
                {currentReadingStep.title}
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              {currentReadingStep.text}
            </p>
          </div>
        )}

        {/* Step dots (reading only) */}
        {!isQuiz && (
          <div className="step-dot-row" style={{ marginBottom: '24px' }}>
            {[0, ...lesson.steps.map((_, i) => i + 1)].map(s => (
              <div key={s} style={{
                width: s === step ? '20px' : '6px',
                height: '5px', borderRadius: '3px',
                background: s < step ? 'var(--green)' : s === step ? 'var(--accent)' : 'var(--border-light)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: s === step ? '0 0 6px var(--accent-glow)' : 'none',
              }} />
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={isQuiz && step > 0 && !questionAnswered}
          style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: isQuiz ? '0' : '0' }}
        >
          {ctaLabel}
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '14px' }}>
          {(isQuiz
            ? ['quiz', `${questions.length} questions`, `${lesson.xp} XP`]
            : ['beginner', '~2 min', '3 steps']
          ).map((t, i) => (
            <span key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}