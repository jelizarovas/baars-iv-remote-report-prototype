import { useLanguage } from '../i18n/LanguageContext';
import { IsometricIllustration } from './IsometricIllustration';

export function Welcome({ onStart, onInvite }: { onStart: () => void; onInvite: () => void }) {
  const { language } = useLanguage();
  const copy = language === 'en' ? {
    title: 'Choose how to complete the questionnaire', lede: 'Answer about an adult you know well, or ask someone who knows you to answer about you. Each response creates its own PDF.',
    privacy: 'Your data stays in your browser.', privacyBody: 'There is no account or server submission. Your browser saves unfinished answers on this device.',
    fill: 'Answer about someone', fillHint: 'Start the questionnaire now', invite: 'Ask someone to answer about me', inviteHint: 'Create a link for them',
  } : {
    title: 'Pasirinkite, kaip pildysite klausimyną', lede: 'Atsakykite apie gerai pažįstamą suaugusį žmogų arba paprašykite kito žmogaus atsakyti apie jus. Kiekvienas atsakymas sukurs atskirą PDF.',
    privacy: 'Duomenys lieka jūsų naršyklėje.', privacyBody: 'Paskyra nekuriama, o duomenys nesiunčiami į serverį. Nebaigtus atsakymus naršyklė išsaugo šiame įrenginyje.',
    fill: 'Atsakyti apie kitą žmogų', fillHint: 'Pradėti klausimyną dabar', invite: 'Paprašyti atsakyti apie mane', inviteHint: 'Sukurti jam nuorodą',
  };
  return <main className="welcome-experience material-page"><section className="welcome-panel">
    <div className="welcome-copy"><div className="brand-mark">BAARS-IV</div><h1>{copy.title}</h1><p className="lede">{copy.lede}</p>
      <div className="welcome-note"><strong>{copy.privacy}</strong><span>{copy.privacyBody}</span></div>
      <div className="welcome-actions"><button className="primary" onClick={onStart}><span className="welcome-action-icon" aria-hidden="true">→</span><strong>{copy.fill}</strong><small>{copy.fillHint}</small></button><button onClick={onInvite}><span className="welcome-action-icon" aria-hidden="true">↗</span><strong>{copy.invite}</strong><small>{copy.inviteHint}</small></button></div>
    </div><aside className="welcome-art"><IsometricIllustration variant="welcome"/></aside>
  </section></main>;
}
