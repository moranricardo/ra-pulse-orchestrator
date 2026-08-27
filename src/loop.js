const { execSync } = require('child_process');

const INTERVALO_MS = 30000; // 30 segundos

console.log('🔄 Iniciando bucle autónomo protegido (Fase 4)...');
console.log(`⏱️ Frecuencia de latido: Cada ${INTERVALO_MS / 1000} segundos. Presiona Ctrl + C para detener.`);

function ejecutarCiclo() {
  try {
    console.log('\n----------------------------------------');
    console.log(`[${new Date().toISOString()}] Ejecutando ciclo autónomo con autodiagnóstico...`);
    
    execSync('node src/pulse.js', { stdio: 'inherit' });

  } catch (error) {
    console.error('❌ Error crítico en el bucle autónomo:', error.message);
  }
}

// Ejecutar el primer ciclo de inmediato
ejecutarCiclo();

// Mantener el bucle corriendo
setInterval(ejecutarCiclo, INTERVALO_MS);
