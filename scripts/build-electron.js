const { build } = require('esbuild')
const path = require('path')

// Build main process
build({
  entryPoints: ['src/main/main.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  external: ['electron'],
  outfile: 'dist/main.js',
  minify: false,
  sourcemap: true,
}).catch(() => process.exit(1))

// Build preload script
build({
  entryPoints: ['src/main/preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  external: ['electron'],
  outfile: 'dist/preload.js',
  minify: false,
  sourcemap: true,
}).catch(() => process.exit(1))
