import { useEffect, useState, type ReactNode } from 'react';
import TempoLogo from './TempoLogo';

export default function StartupScreen({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'done'>('visible');
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const exit = window.setTimeout(() => setPhase('exiting'), reduced ? 150 : 1600);
    const finish = window.setTimeout(() => setPhase('done'), reduced ? 200 : 2000);
    return () => { window.clearTimeout(exit); window.clearTimeout(finish); };
  }, []);
  const showing = phase !== 'done';
  return <>
    <div className="tempo-content" inert={showing} aria-hidden={showing || undefined}>{children}</div>
    {showing && <div className="tempo-startup" data-phase={phase} role="status" aria-label="Iniciando Tempo">
      <div className="tempo-startup-center">
        <TempoLogo className="tempo-startup-logo" decorative />
      </div>
    </div>}
  </>;
}
