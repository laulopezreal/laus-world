
import { cp, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Sync Configuration
const OBSIDIAN_REPO = path.resolve(projectRoot, '../Obsidian');
const VAULTS_TO_SYNC = ['Astrazeneca', 'Training'];

const CONFIG = {
    // Where to put them in the web app
    targetRoot: path.resolve(projectRoot, 'public/vault'),
    exclude: ['.obsidian', '.git', 'node_modules', '.DS_Store']
};

async function syncVaults() {
    console.log('🔄 Starting Multi-Vault Sync...');
    console.log(`📂 Notes Repository: ${OBSIDIAN_REPO}`);

    if (!fs.existsSync(OBSIDIAN_REPO)) {
        console.error(`❌ Obsidian repo not found at: ${OBSIDIAN_REPO}`);
        process.exit(1);
    }

    // 1. Clean entire target vault directory to ensure freshness
    console.log('🧹 Cleaning target vault...');
    await rm(CONFIG.targetRoot, { recursive: true, force: true });
    await mkdir(CONFIG.targetRoot, { recursive: true });

    // 2. Iterate and sync each vault
    for (const vaultName of VAULTS_TO_SYNC) {
        const sourcePath = path.join(OBSIDIAN_REPO, vaultName);
        const targetPath = path.join(CONFIG.targetRoot, vaultName);

        console.log(`\n📦 Syncing Vault: ${vaultName}`);
        console.log(`   From: ${sourcePath}`);
        console.log(`   To:   ${targetPath}`);

        if (!fs.existsSync(sourcePath)) {
            console.warn(`   ⚠️ Source vault not found: ${sourcePath} (Skipping)`);
            continue;
        }

        await mkdir(targetPath, { recursive: true });

        await cp(sourcePath, targetPath, {
            recursive: true,
            filter: (src, dest) => {
                const basename = path.basename(src);
                if (CONFIG.exclude.includes(basename)) return false;
                if (basename.startsWith('.') && basename !== '.htaccess') return false;
                return true;
            }
        });
        console.log(`   ✅ Synced ${vaultName}`);
    }

    console.log('\n✨ All Vaults Synced Successfully!');
}

syncVaults().catch(err => {
    console.error('❌ Sync Failed:', err);
    process.exit(1);
});
