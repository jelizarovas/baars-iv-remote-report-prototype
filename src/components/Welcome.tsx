import { useLanguage } from '../i18n/LanguageContext';

export function Welcome({ onStart, onInvite }: { onStart: () => void; onInvite: () => void }) {
  const { language } = useLanguage();
  const copy = language === 'en' ? {
    title: 'Behavior questionnaire', lede: 'Answer questions about an adult you know well. When you finish, you can download the completed PDF. This site does not provide a diagnosis.',
    privacy: 'Your data stays in your browser.', privacyBody: 'There is no account or server submission. Your browser saves unfinished answers on this device.',
    fill: 'Fill out the questionnaire', invite: 'Invite someone to fill it out',
  } : {
    title: 'Elgesio klausimynas', lede: 'Atsakykite apie gerai pažįstamą suaugusį žmogų. Baigę galėsite atsisiųsti užpildytą PDF. Ši svetainė neskaičiuoja diagnozės.',
    privacy: 'Duomenys lieka jūsų naršyklėje.', privacyBody: 'Paskyra nekuriama, o duomenys nesiunčiami į serverį. Nebaigtus atsakymus naršyklė išsaugo šiame įrenginyje.',
    fill: 'Pildyti klausimyną', invite: 'Pakviesti kitą žmogų',
  };
  return <main className="setup-shell"><section className="setup-card welcome-card">
    <div className="brand-mark">BAARS-IV</div>
    <h1>{copy.title}</h1>
    <p className="lede">{copy.lede}</p>
    <div className="welcome-note">
      <strong>{copy.privacy}</strong>
      <span>{copy.privacyBody}</span>
    </div>
    <div className="welcome-actions">
      <button className="primary" onClick={onStart}><strong>{copy.fill}</strong></button>
      <button onClick={onInvite}><strong>{copy.invite}</strong></button>
    </div>
  </section></main>;
}
