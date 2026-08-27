const AutoHealer = require('./auto_healer');
const StateManager = require('./state_manager');

console.log('🧪 [Test Stress] Iniciando simulación de memoria elevada...');

const healer = new AutoHealer();
const stateManager = new StateManager();

// Creamos un escenario de métricas ficticias con alto consumo de memoria Heap
const fakeMetrics = {
  uptime_seconds: 3600,
  rss_memory_mb: '250.00',
  heap_used_mb: '150.50' // Supera el límite seguro configurado
};

console.log('📊 Métricas simuladas inyectadas:', fakeMetrics);

// Evaluamos la salud con las métricas falsas
const healthResult = healer.evaluateHealth(fakeMetrics);
console.log('🔍 Resultado de la evaluación de salud:', healthResult);

// Aplicamos las correcciones basadas en el diagnóstico
const statusResult = healer.applyCorrections(healthResult);
console.log('🛡️ Estado veredicto por el AutoHealer:', statusResult);

// Actualizamos temporalmente el estado para ver cómo lo registraría el sistema
const updatedState = stateManager.updateState({
  status: statusResult,
  lastError: healthResult.isHealthy ? null : healthResult.alerts.join(' | ')
});

console.log('✅ [Test Stress] Prueba finalizada. Estado resultante:', updatedState);
