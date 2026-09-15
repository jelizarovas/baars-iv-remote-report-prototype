import type { ReactNode } from 'react';
import { NeuralBackground } from './IsometricIllustration';

export function AppLayout({ route, children }: { route: string; children: ReactNode }) {
  return <div className={`app-layout route-${route}`}>
    <NeuralBackground/>
    <div className="route-stage" key={route}>{children}</div>
  </div>;
}
