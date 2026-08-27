const StateManager = require('./state_manager');
const AutoHealer = require('./auto_healer');
const EvolutionAudit = require('./evolution_audit');
const CloudSync = require('./sync_cloud');
const AgentListener = require('./agent_listener');

async function runPulse() {
  console.log('⚡ Ejecutando pulso con soporte Multi-Agente (Fase 4/5)...');

  // 1. Ejecutar el monitor para capturar métricas frescas
  require('./system_monitor');

  const stateManager = new StateManager();
  const healer = new AutoHealer();
  const auditor = new EvolutionAudit();
  const cloudSync = new CloudSync();
  const agentListener = new AgentListener();

  // 2. Revisar si hay directivas pendientes de agentes externos
  const agentResponse = agentListener.checkIncomingDirectives();
  if (agentResponse) {
    console.log('🤖 [Multi-Agent] Directiva externa procesada con éxito:', agentResponse);
  }

  // 3. Cargar el estado actual (incluyendo las nuevas métricas)
  const currentState = stateManager.loadState();

  // 4. Evaluar salud y aplicar autoprotección
  const health = healer.evaluateHealth(currentState.metrics);
  const determinedStatus = healer.applyCorrections(health);

  // 5. Actualizar el estado global con el veredicto de salud
  const updatedState = stateManager.updateState({
    status: determinedStatus,
    lastError: health.isHealthy ? null : health.alerts.join(' | ')
  });

  // 6. Generar reporte de auditoría histórica
  auditor.generateAuditReport();

  // 7. Sincronizar y empujar todo el paquete de datos hacia la nube de forma autónoma
  console.log('🌐 Iniciando sincronización autónoma hacia el ecosistema remoto...');
  cloudSync.sync();

  console.log(`✅ Pulso evaluado y respaldado. Estado de salud: ${health.isHealthy ? 'SALUDABLE' : 'CON ALERTAS'}.`);
  console.log('📊 Estado actual guardado y sincronizado:', updatedState);
}

runPulse();
