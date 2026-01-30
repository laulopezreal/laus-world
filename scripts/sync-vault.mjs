
import { cp, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Default config
const CONFIG = {
    // Going up from 'lauras-world/scripts' -> 'lauras-world' -> 'Obsidian' -> 'Astrazeneca'
    sourceDir: path.resolve(projectRoot, '../Astrazeneca'),
    targetDir: path.resolve(projectRoot, 'vault'),
    // Subfolders to exclude if needed
    exclude: ['.obsidian', '.git', 'node_modules']
};

async function syncVault() {
    console.log('🔄 Starting Vault Sync...');
    console.log(`📂 Source: ${CONFIG.sourceDir}`);
    console.log(`📂 Target: ${CONFIG.targetDir}`);

    if (!fs.existsSync(CONFIG.sourceDir)) {
        console.error(`❌ Source directory not found: ${CONFIG.sourceDir}`);
        process.exit(1);
    }

    // 1. Clean target directory (optional - be careful not to delete system files)
    // For safety, we might just overwrite. But to remove deleted notes, cleaning is best.
    // We'll preserve 'Welcome.md' or similar if intended, but usually a full sync is better.
    console.log('🧹 Cleaning target directory...');
    await rm(CONFIG.targetDir, { recursive: true, force: true });
    await mkdir(CONFIG.targetDir, { recursive: true });

    // 2. recursive copy
    console.log('📦 Copying files...');

    // We use fs.cp with a filter function
    await cp(CONFIG.sourceDir, CONFIG.targetDir, {
        recursive: true,
        filter: (src, dest) => {
            const basename = path.basename(src);
            // Skip hidden files/dirs (starting with .) except if needed? 
            // Actually usually we want to skip .obsidian folder but keep .md files.
            if (CONFIG.exclude.includes(basename)) return false;
            if (basename.startsWith('.') && basename !== '.htaccess') return false; // skip hidden files
            return true;
        }
    });

    console.log('✅ Sync Complete!');
}

syncVault().catch(err => {
    console.error('❌ Sync Failed:', err);
    process.exit(1);
});
