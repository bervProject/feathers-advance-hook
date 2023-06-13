// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import sizes from 'rollup-plugin-sizes';
import terser from '@rollup/plugin-terser';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' assert { type: "json" };

const extensions = ['.ts'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: pkg.source,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    external(),
    resolve({
      mainFields: ['module', 'main', 'jsnext:main', 'browser'],
      extensions,
    }),
    babel({
      exclude: 'node_modules/**',
      configFile: path.resolve(__dirname, 'babel.config.js'),
      extensions,
    }),
    del({ targets: ['dist/*'] }),
    terser(),
    sizes(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
