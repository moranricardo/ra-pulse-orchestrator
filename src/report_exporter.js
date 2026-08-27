const fs = require('fs');
const path = require('path');

class ReportExporter {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.statePath = path.join(this.rootDir, 'state.json');
    this.auditPath = path.join(this.rootDir, 'evolution_audit.json');
    this.exportPath = path.join(this.rootDir, 'system_report.json');
  }

  exportReport() {
    try {
      let stateData = {};
      let auditData = [];

      if (fs.existsSync(this.statePath)) {
        stateData = JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
      }

      if (fs.existsSync(this.auditPath)) {
        auditData = JSON.parse(fs.readFileSync(this.auditPath, 'utf8'));
      }

      // Estructura de reporte optimizada para revisión multi-agente / ecosistema familiar
      const executiveReport = {
        metadatos: {
          generadoEn: new Date().toISOString(),
          sistemaObjetivo: "RA-Pulse-Orchestrator",
          entorno: "Moto E6 - Termux Local",
          arquitecto: "Ricardo Moran Maldonado"
        },
        estadoOperativoActual: {
          estadoSistema: stateData.status || "UNKNOWN",
          ultimoPulso: stateData.last_pulse || "N/A",
          memoriaHeapMb: stateData.metrics ? stateData.metrics.heap_used_mb : "N/A",
          tiempoActivoUptime: stateData.metrics ? stateData.metrics.uptime_seconds : 0,
          ultimoError: stateData.lastError || "Ninguno (Sistema Saludable)"
        },
        bitacoraEvolutiva: {
          totalPulsesRegistrados: auditData.length,
          ultimoSaludCheck: auditData.length > 0 ? auditData[auditData.length - 1].healthCheck : "UNKNOWN",
          ultimosRegistros: auditData.slice(-3) // Mostramos los últimos 3 eventos para auditoría rápida
        }
      };

      fs.writeFileSync(this.exportPath, JSON.stringify(executiveReport, null, 2));
      console.log('📤 [ReportExporter] Reporte ejecutivo optimizado generado en system_report.json');

      return executiveReport;
    } catch (error) {
      console.error('❌ Error al exportar el reporte estructurado:', error.message);
      return null;
    }
  }
}

module.exports = ReportExporter;
