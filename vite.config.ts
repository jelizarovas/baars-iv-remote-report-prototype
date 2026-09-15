import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ base: '/baars-iv-remote-report-prototype/', plugins: [react()], test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: true } });
