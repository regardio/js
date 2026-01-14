import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/assert/index.ts',
    'src/encoding/index.ts',
    'src/http/index.ts',
    'src/intl/index.ts',
    'src/text/index.ts',
    'src/time/index.ts',
  ],
  format: 'esm',
  outDir: 'dist',
  sourcemap: false,
  treeshake: true,
});
