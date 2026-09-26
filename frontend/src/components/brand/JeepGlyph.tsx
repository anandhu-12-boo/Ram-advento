type Props = { className?: string; size?: number };

/** Lightweight 2D jeep silhouette inspired by the Ram Adventure badge. */
export function JeepGlyph({ className, size = 28 }: Props) {
  return (
    <svg
      viewBox="0 0 64 34"
      width={size}
      height={(size * 34) / 64}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <path d="M4 20h4l3-8h14l2 8h9l3-8h13l3 8h5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a7 7 0 0 0-13 0H24a7 7 0 0 0-13 0H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 0-0z" />
        <rect x="12" y="6" width="34" height="2.4" rx="1.2" />
        <circle cx="17.5" cy="27" r="6" />
        <circle cx="46.5" cy="27" r="6" />
      </g>
      <circle cx="17.5" cy="27" r="2.4" fill="var(--forest-deep)" />
      <circle cx="46.5" cy="27" r="2.4" fill="var(--forest-deep)" />
    </svg>
  );
}

export function MountainGlyph({ className, size = 28 }: Props) {
  return (
    <svg
      viewBox="0 0 64 40"
      width={size}
      height={(size * 40) / 64}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 38 20 8l10 15 7-9 25 24z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
