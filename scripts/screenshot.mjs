import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const portfolioUrl = process.env.PORTFOLIO_URL || 'http://localhost:4173';
const appUrl = process.env.LAURAS_WORLD_URL || 'http://localhost:5173';
const outputDir = path.resolve('docs/screenshots');

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

await page.goto(portfolioUrl, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(outputDir, 'portfolio-home.png'), fullPage: true });

await page.goto(appUrl, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(outputDir, 'lauras-world-home.png'), fullPage: true });

await page.goto(`${appUrl}/note/welcome`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(outputDir, 'lauras-world-note.png'), fullPage: true });

await browser.close();

console.log('Screenshots saved to docs/screenshots');
