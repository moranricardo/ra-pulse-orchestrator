const AutoHealer = require('./auto_healer');
const StateManager = require('./state_manager');
const EvolutionAudit = require('./evolution_audit');

console.log('🔄 [Test Recovery] Iniciando simulación de recuperación y normalización...');

const healer = new AutoHealer();
const stateManager = new StateManager();
const auditor = new EvolutionAudit();

// Métricas simuladas dentro de rangos totalmente seguros y saludables
const recoveredMetrics = {
  uptime_seconds: 7200,
  rss_memory_mb: '30.10',
  heap_used_mb: '2.45' // Muy por debajo del límite, totalmente saludable
};

console.log('📊 Métricas de recuperación inyectadas:', recoveredMetrics);

// Evaluamos la salud
const healthResult = healer.evaluateHealth(recoveredMetrics);
console.log('🔍 Resultado de la evaluación de salud:', healthResult);

// Aplicamos correcciones (debería regresar a OPTIMIZED)
const statusResult = healer.applyCorrections(healthResult);
console.log('🛡️ Estado veredicto por el AutoHealer:', statusResult);

// Actualizamos el estado global
const updatedState = stateManager.updateState({
  status: statusResult,
  metrics: recoveredMetrics,
  lastError: null // Limpiamos el error previo al recuperarse
});

// Generamos auditoría del evento de recuperación
auditor.generateAuditReport();

console.log('✅ [Test Recovery] Sistema recuperado con éxito. Estado final:', updatedState);
