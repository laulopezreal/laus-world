import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [notePathArg, targetTitle] = process.argv.slice(2);

if (!notePathArg || !targetTitle) {
  console.error('Usage: node scripts/insert-link.mjs <note-path> "<target-title>"');
  process.exit(1);
}

const vaultRoot = path.resolve('public/vault');
const notePath = path.resolve(vaultRoot, notePathArg);
const linkText = `[[${targetTitle}]]`;

const main = async () => {
  const raw = await readFile(notePath, 'utf-8');
  if (raw.includes(linkText)) {
    console.log('Link already present. No changes made.');
    return;
  }

  const lines = raw.split('\n');
  const insertIndex = lines.findIndex((line) => line.startsWith('#'));
  const targetIndex = insertIndex >= 0 ? insertIndex + 1 : 0;
  lines.splice(targetIndex, 0, '', linkText, '');

  await writeFile(notePath, lines.join('\n'));
  console.log(`Inserted link into ${notePath}`);
};

main().catch((err) => {
  console.error('Failed to insert link:', err);
  process.exit(1);
});
