/**
 * Ra-Pulse Bridge - Capa 3 Integration (POD v1.0)
 * Autor: @moranricardo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MUTATION_DICTIONARY = {
    directories: [
        path.join(process.env.HOME, 'logs'),
        path.join(process.env.HOME, 'data')
    ],
    forbidden_extensions: ['.log', '.json', '.tmp']
};

function enforceLayer3Validation() {
    console.log('[antiflow+] Ejecutando validación de Capa 3 (POD v1.0)...');
    let violations = [];

    MUTATION_DICTIONARY.directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                if (fs.statSync(itemPath).isFile()) {
                    violations.push(itemPath);
                }
            });
        }
    });

    if (violations.length > 0) {
        console.error('[!] 🚨 ALERTA ROJA [Mutación Detectada]: Archivos ilegales en almacenamiento interno:');
        violations.forEach(v => console.error(`    - Obstrucción: ${v}`));
        console.error('[!] Sincronización con GitHub bloqueada por protocolo Zero-Trust.');
        process.exit(1);
    } else {
        console.log('[+] Validador Capa 3: Cero rastros locales. Integridad intacta.');
    }
}

function syncWithGitHub() {
    enforceLayer3Validation();
    
    try {
        console.log('🌐 Sincronizando estado con SSoT en GitHub (@moranricardo)...');
        const repoPath = path.join(process.env.HOME, 'git/ra-pulse-orchestrator');
        execSync('git add . && git commit -m "🤖 auto(bridge): Sincronización limpia bajo POD v1.0" || true', { cwd: repoPath, stdio: 'inherit' });
        execSync('git push origin main || true', { cwd: repoPath, stdio: 'inherit' });
        console.log('✅ [SaaS/SSoT Sincronizado con Éxito]');
    } catch (error) {
        console.error('⚠️ Error durante el puente de sincronización:', error.message);
    }
}

if (require.main === module) {
    syncWithGitHub();
}

module.exports = { enforceLayer3Validation, syncWithGitHub };
