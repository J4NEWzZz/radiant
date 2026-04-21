import { useState, useEffect } from 'react';
import { LEARNING_AREAS } from '../data/content';
import { useStore } from '../store/useStore';
import { HTTPVisualization } from '../visualizations/HTTPVisualization';
import { NeuralNetworkVisualization } from '../visualizations/NeuralNetworkVisualization';
import { BinarySearchVisualization } from '../visualizations/BinarySearchVisualization';

function Visualization({ vizType, step }: { vizType: string; step: number }) {
  if (vizType === 'neural') return <NeuralNetworkVisualization step={step} />;
  if (vizType === 'bst') return <BinarySearchVisualization step={step} />;
  return <HTTPVisualization step={step} />;
}

export function Lesson() {
  const { currentLessonId, completeLesson, setScreen } = useStore();
  const [step, setStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completing, setCompleting] = useState(false);

  const lesson = LEARNING_AREAS.flatMap(a => a.lessons).find(l => l.id === currentLessonId);
  const area = LEARNING_AREAS.find(a => a.id === lesson?.areaId);

  useEffect(() => {
    setStep(0);
    setShowCompletion(false);
    setCompleting(false);
  }, [currentLessonId]);

  if (!lesson || !area) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Lesson not found.</div>
        <button className="btn-ghost" onClick={() => setScreen('dashboard')}>Back to dashboard</button>
      </div>
    );
  }

  const totalSteps = lesson.steps.length;
  const currentStep = lesson.steps[step - 1];
  const isLastStep = step === totalSteps;

  function handleNext() {
    if (isLastStep) {
      setShowCompletion(true);
    } else {
      setStep(s => s + 1);
    }
  }

  async function handleComplete() {
    setCompleting(true);
    await completeLesson(lesson!.id, lesson!.xp);
    setCompleting(false);
  }

  if (showCompletion) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background radial */}
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
            fontSize: '36px', boxShadow: '0 0 40px var(--accent-glow)',
          }}>
            ⚡
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px',
          }}>
            LESSON COMPLETE
          </div>

          <div className="text-gradient" style={{
            fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: '800',
            lineHeight: '1', marginBottom: '10px',
          }}>
            +{lesson.xp}<span style={{ fontSize: '22px' }}>XP</span>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px', fontFamily: 'var(--font-mono)' }}>
            {lesson.title}
          </div>

          {/* Floating particles */}
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
            <button className="btn-primary" onClick={handleComplete} disabled={completing}
              style={{ padding: '14px', fontSize: '15px' }}>
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px' }}>

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

          {/* Step progress */}
          <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
            {lesson.steps.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: i < step ? 'var(--green)' : i === step - 1 ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.4s ease',
                boxShadow: i === step - 1 ? '0 0 6px var(--accent-glow)' : 'none',
              }} />
            ))}
          </div>

          <div className="badge-xp" style={{ flexShrink: 0 }}>+{lesson.xp} XP</div>
        </div>

        {/* Title + intro */}
        <div className="anim-slide-up" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>{area.icon}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{area.name}</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800',
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

        {/* Visualization */}
        <div className="card anim-slide-up delay-1" style={{
          padding: '20px', marginBottom: '16px',
          background: 'var(--surface)',
          minHeight: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderLeft: '2px solid var(--accent)',
        }}>
          <Visualization vizType={lesson.vizType} step={step} />
        </div>

        {/* Step content */}
        {currentStep && (
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
                {currentStep.title}
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              {currentStep.text}
            </p>
          </div>
        )}

        {/* Step dots */}
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

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={handleNext}
          style={{ width: '100%', padding: '14px', fontSize: '15px' }}
        >
          {step === 0
            ? 'Start lesson →'
            : isLastStep
            ? 'Finish lesson ✓'
            : `Next: ${lesson.steps[step]?.title ?? ''} →`}
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '14px' }}>
          {['beginner', '~2 min', '3 steps'].map((t, i) => (
            <span key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
