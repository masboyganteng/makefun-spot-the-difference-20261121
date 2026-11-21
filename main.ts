// Hand-in step for make.fun: put the game and its screenshots in the output folder, then write the dossier.
// Run with `node main.ts`; set MAKEFUN_OUTPUT_DIR to choose the folder (it falls back to /output).
// Uses only Node's standard library; the output is the same bytes on every run.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function copyFolder(name: string): void {
  const from = join(repoRoot, name);
  const to = join(outDir, name);
  if (!existsSync(from)) throw new Error(`missing ${name}/ next to main.ts`);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyFolder('game');
copyFolder('screenshots');
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, CAPS));
console.log(`dossier written to ${join(outDir, 'dossier.json')}`);
