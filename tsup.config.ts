import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/async/delay.ts',
    'src/browser/base64.ts',
    'src/format/bytes.ts',
    'src/format/measure.ts',
    'src/http/cookie.ts',
    'src/http/domain.ts',
    'src/http/request-helpers.ts',
    'src/intl/language-detector.ts',
    'src/time/time.ts',
    'src/validation/invariant.ts',
    'src/validation/verify-file-accept.ts',
  ],
  format: ['esm'],
  minify: false,
  outDir: 'dist',
  platform: 'neutral',
  sourcemap: false,
  splitting: false,
  treeshake: true,
});
