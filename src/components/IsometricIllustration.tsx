export function IsometricIllustration({ variant = 'forms' }: { variant?: 'forms' | 'welcome' }) {
  const id = `iso-${variant}`;
  return <svg className={`isometric-illustration ${variant}`} viewBox="0 0 260 210" role="img" aria-label={variant === 'welcome' ? 'Abstract questionnaire illustration' : 'Abstract invitation illustration'}>
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#e8f4f0"/></linearGradient>
      <linearGradient id={`${id}-green`} x1="0" x2="1"><stop stopColor="#2b8c78"/><stop offset="1" stopColor="#105b4d"/></linearGradient>
      <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#173c34" floodOpacity=".16"/></filter>
    </defs>
    <ellipse cx="132" cy="181" rx="91" ry="18" fill="#cfe2dc" opacity=".65"/>
    <g filter={`url(#${id}-shadow)`} transform="translate(19 2)">
      <path d="M33 102 118 54l101 58-86 50z" fill="#d8ebe6"/>
      <path d="m33 102 100 59v23L33 125z" fill="#9bc9bd"/>
      <path d="m133 161 86-49v23l-86 49z" fill="#63a997"/>
      <g transform="translate(64 29) rotate(30 70 70) skewX(-30)">
        <rect x="18" y="14" width="128" height="105" rx="9" fill={`url(#${id}-paper)`}/>
        <rect x="35" y="33" width="54" height="8" rx="4" fill="#176b5b"/>
        <rect x="35" y="51" width="91" height="5" rx="2.5" fill="#afc9c2"/>
        <rect x="35" y="65" width="78" height="5" rx="2.5" fill="#c8d9d5"/>
        <circle cx="42" cy="88" r="8" fill="#d6ece6" stroke="#176b5b" strokeWidth="3"/>
        <path d="m38 88 3 3 6-7" fill="none" stroke="#176b5b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="57" y="84" width="61" height="7" rx="3.5" fill="#afc9c2"/>
      </g>
    </g>
    {variant === 'forms' ? <g transform="translate(155 19) rotate(9)" filter={`url(#${id}-shadow)`}>
      <path d="M10 32 55 7l45 25-45 28z" fill="#fff" stroke="#7fb7aa" strokeWidth="2"/>
      <path d="M10 32v35l45 25V60z" fill="#dff0eb" stroke="#7fb7aa" strokeWidth="2"/>
      <path d="M100 32v35L55 92V60z" fill="#b8ddd4" stroke="#7fb7aa" strokeWidth="2"/>
      <path d="m13 34 42 24 42-24" fill="none" stroke="#176b5b" strokeWidth="3"/>
      <circle cx="56" cy="47" r="4" fill="#efb85b"/>
    </g> : <g transform="translate(173 24)" filter={`url(#${id}-shadow)`}>
      <path d="M28 3 53 18v30L28 63 3 48V18z" fill={`url(#${id}-green)`}/>
      <circle cx="21" cy="31" r="3" fill="#fff"/><circle cx="36" cy="31" r="3" fill="#fff"/>
      <path d="M20 42q8 7 16 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </g>}
    <g transform="translate(25 30) rotate(-12)"><circle cx="15" cy="15" r="15" fill="#ffd989"/><path d="m9 15 4 4 9-11" fill="none" stroke="#73501c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g>
  </svg>;
}
