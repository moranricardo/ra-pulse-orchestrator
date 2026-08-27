const { execSync } = require('child_process');
const ReportExporter = require('./report_exporter');

class CloudSync {
  constructor() {
    this.exporter = new ReportExporter();
  }

  sync() {
    console.log('🔄 [CloudSync] Iniciando proceso de sincronización con la nube...');
    
    // 1. Generar el reporte fresco más reciente
    const report = this.exporter.exportReport();
    if (!report) {
      console.error('❌ [CloudSync] No se pudo generar el reporte. Abortando sincronización.');
      return false;
    }

    try {
      // 2. Ejecutar comandos de Git para respaldar y subir el reporte
      console.log('📦 [CloudSync] Preparando archivos para Git...');
      execSync('git add system_report.json evolution_audit.json state.json', { stdio: 'inherit' });
      
      const commitMessage = `[Auto-Sync] Reporte ejecutivo y pulso - ${new Date().toISOString()}`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      console.log('🚀 [CloudSync] Empujando cambios al repositorio remoto...');
      execSync('git push', { stdio: 'inherit' });

      console.log('✅ [CloudSync] ¡Sincronización completada con éxito!');
      return true;
    } catch (error) {
      console.error('⚠️ [CloudSync] Nota de Git (puede que no haya cambios nuevos o falte autenticación):', error.message);
      return false;
    }
  }
}

// Permitir ejecución directa desde la terminal
if (require.main === module) {
  const syncer = new CloudSync();
  syncer.sync();
}

module.exports = CloudSync;
