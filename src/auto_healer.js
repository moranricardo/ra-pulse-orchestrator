class AutoHealer {
  constructor() {
    this.MAX_HEAP_MB = 15.0; // Umbral real y seguro para el Moto E6
  }

  evaluateHealth(metrics) {
    const alerts = [];
    const heapUsed = parseFloat(metrics.heap_used_mb);
    if (heapUsed > this.MAX_HEAP_MB) {
      alerts.push(`ALERTA: Memoria Heap alta (${heapUsed} MB > ${this.MAX_HEAP_MB} MB)`);
    }

    return {
      isHealthy: alerts.length === 0,
      alerts: alerts
    };
  }

  applyCorrections(healthStatus) {
    if (!healthStatus.isHealthy) {
      console.warn('⚠️ AutoHealer detectó anomalías:', healthStatus.alerts);
      if (global.gc) {
        global.gc();
        console.log('🧹 Recolección de basura forzada.');
      }
      return 'DEGRADED_MODE_RECOVERING';
    }
    
    return 'OPTIMIZED';
  }
}

module.exports = AutoHealer;
