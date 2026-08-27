const fs = require('fs');
const path = require('path');

class EvolutionAudit {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.statePath = path.join(this.rootDir, 'state.json');
    this.auditPath = path.join(this.rootDir, 'evolution_audit.json');
  }

  generateAuditReport() {
    if (!fs.existsSync(this.statePath)) {
      console.warn('⚠️ No se encontró el archivo state.json para auditar.');
      return null;
    }

    try {
      const currentState = JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
      
      let auditLog = [];
      if (fs.existsSync(this.auditPath)) {
        auditLog = JSON.parse(fs.readFileSync(this.auditPath, 'utf8'));
      }

      const auditEntry = {
        timestamp: new Date().toISOString(),
        systemStatus: currentState.status,
        heapUsedMb: currentState.metrics.heap_used_mb,
        uptimeSeconds: currentState.metrics.uptime_seconds,
        healthCheck: currentState.lastError === null ? 'PASSED' : 'DEGRADED'
      };

      auditLog.push(auditEntry);

      if (auditLog.length > 50) {
        auditLog = auditLog.slice(-50);
      }

      fs.writeFileSync(this.auditPath, JSON.stringify(auditLog, null, 2));
      console.log('🧬 [EvolutionAudit] Reporte de auditoría generado con éxito.');

      return auditEntry;
    } catch (error) {
      console.error('❌ Error al generar la auditoría evolutiva:', error.message);
      return null;
    }
  }
}

module.exports = EvolutionAudit;
