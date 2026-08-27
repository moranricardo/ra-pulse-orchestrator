const fs = require('fs');
const path = require('path');
const { processEvolutionPatch } = require('./evolution_engine');

const INCOMING_DIR = path.join(__dirname, '../sync/mailbox/incoming');

function watchMailbox() {
  console.log(`👁️ [$chrome-mobile-es-419] Monitoreando buzón local en: ${INCOMING_DIR}`);
  
  if (!fs.existsSync(INCOMING_DIR)) {
    fs.mkdirSync(INCOMING_DIR, { recursive: true });
  }

  fs.watch(INCOMING_DIR, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
      const filePath = path.join(INCOMING_DIR, filename);
      
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const message = JSON.parse(rawData);
            
            console.log(`📥 [$chrome-mobile-es-419] Mensaje recibido de [${message.sender}]: ${message.payload.action}`);
            
            if (message.payload.action === 'MUTATE_AST') {
              const result = processEvolutionPatch(filePath, message.payload);
              console.log(`⚡ [$chrome-mobile-es-419] Resultado de mutación:`, result);
            } else {
              console.log(`ℹ️ [$chrome-mobile-es-419] Procesado aviso de estado: ${message.payload.status}`);
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
          } catch (err) {
            console.error(`❌ [$chrome-mobile-es-419] Error procesando mensaje del buzón: ${err.message}`);
          }
        }
      }, 500);
    }
  });
}

if (require.main === module) {
  watchMailbox();
}

module.exports = { watchMailbox };
