export function Welcome({ onStart, onInvite }: { onStart: () => void; onInvite: () => void }) {
  return <main className="setup-shell"><section className="setup-card welcome-card">
    <div className="brand-mark">BAARS-IV</div>
    <h1>Elgesio klausimynas<br/><span>Behavior questionnaire</span></h1>
    <p className="lede">Atsakykite apie gerai pažįstamą suaugusį žmogų. Baigę galėsite atsisiųsti užpildytą PDF. Ši svetainė neskaičiuoja diagnozės.</p>
    <p className="welcome-english">Answer questions about an adult you know well. When you finish, you can download the completed PDF. This site does not provide a diagnosis.</p>
    <div className="welcome-note">
      <strong>Duomenys lieka jūsų naršyklėje.</strong>
      <span>There is no account or server submission. Your browser saves unfinished answers on this device.</span>
    </div>
    <div className="welcome-actions">
      <button className="primary" onClick={onStart}><strong>Pildyti klausimyną</strong><span>Fill out the questionnaire</span></button>
      <button onClick={onInvite}><strong>Pakviesti kitą žmogų</strong><span>Invite someone to fill it out</span></button>
    </div>
  </section></main>;
}
