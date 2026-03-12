import { useEffect, useState } from 'react';

const STEPS = [
  'Fetching job posting…',
  'Scanning for red flags…',
  'Analyzing language patterns…',
  'Computing trust score…',
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="loading-state">
        <div className="spinner-ring" />
        <span className="loading-text">Analyzing job post…</span>
        <div className="loading-steps">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`loading-step ${i < activeStep ? 'done' : i === activeStep ? 'active' : ''}`}
            >
              <div className="step-icon">
                {i < activeStep ? '✓' : i === activeStep ? '▶' : '·'}
              </div>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
