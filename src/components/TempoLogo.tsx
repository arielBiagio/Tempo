import { useId } from 'react';

// Present the supplied artwork without retyping its wordmark or changing paths.
// SVG viewports trim the empty margins; a presentation filter removes charcoal
// and maps the original lime artwork to the Electric Slate brand accent.
export default function TempoLogo({ compact = false, className = '', decorative = false }: {
  compact?: boolean; className?: string; decorative?: boolean;
}) {
  const id = useId();
  const filterId = `tempo-ink-${id}`;
  const markClipId = `tempo-mark-${id}`;
  const wordClipId = `tempo-word-${id}`;
  const titleId = `tempo-title-${id}`;
  const artwork = <image href="/brand/tempo-logo.webp" width="1254" height="1254" filter={`url(#${filterId})`} />;
  return (
    <svg
      className={`tempo-logo ${className}`}
      viewBox={compact ? '0 0 160 40' : '150 330 960 630'}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : titleId}
      focusable="false"
    >
      {!decorative && <title id={titleId}>Tempo</title>}
      <defs>
        {/* The mark and the T overlap vertically in the supplied square image. */}
        <clipPath id={markClipId}><path d="M365 330H905V730H400V680H365Z" /></clipPath>
        <clipPath id={wordClipId}><path d="M165 705H420V735H1105V960H165Z" /></clipPath>
        <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix type="matrix" values="0 0 0 0 0.780392  0 0 0 0 0.956863  0 0 0 0 0.392157  0 1.2 0 0 -0.11" />
        </filter>
      </defs>
      {compact ? <>
        <svg x="0" y="0" width="40" height="40" viewBox="365 330 540 400" overflow="hidden"><g clipPath={`url(#${markClipId})`}>{artwork}</g></svg>
        <svg x="46" y="5" width="112" height="30" viewBox="165 705 940 250" overflow="hidden"><g clipPath={`url(#${wordClipId})`}>{artwork}</g></svg>
      </> : artwork}
    </svg>
  );
}
