const fs = require('fs');
const path = require('path');
const StateManager = require('./state_manager');

class AgentListener {
  constructor() {
    this.stateManager = new StateManager();
    this.commandLogPath = path.join(__dirname, '../agent_commands.json');
  }

  // Evaluar si hay instrucciones pendientes enviadas por un agente de IA externo
  checkIncomingDirectives() {
    console.log('🤖 [AgentListener] Escuchando directivas de agentes externos...');

    if (!fs.existsSync(this.commandLogPath)) {
      console.log('ℹ️ [AgentListener] No hay comandos pendientes de agentes.');
      return null;
    }

    try {
      const rawData = fs.readFileSync(this.commandLogPath, 'utf8');
      const directive = JSON.parse(rawData);

      console.log('📥 [AgentListener] Directiva recibida:', directive);

      // Procesar la orden según la instrucción del agente
      const response = this.executeDirective(directive);

      // Limpiar el archivo de directivas una vez procesado para evitar bucles
      fs.unlinkSync(this.commandLogPath);
      console.log('🧹 [AgentListener] Directiva procesada y limpiada.');

      return response;
    } catch (error) {
      console.error('❌ [AgentListener] Error procesando directiva del agente:', error.message);
      return null;
    }
  }

  executeDirective(directive) {
    const currentState = this.stateManager.loadState();
    let result = { executed: false, feedback: '' };

    switch (directive.action) {
      case 'QUERY_STATUS':
        result.executed = true;
        result.feedback = {
          status: currentState.status,
          metrics: currentState.metrics,
          lastError: currentState.lastError
        };
        break;

      case 'FORCE_OPTIMIZE':
        console.log('⚡ [AgentListener] Agente ordenó optimización forzada de memoria...');
        if (global.gc) {
          global.gc();
          result.feedback = 'Recolección de basura ejecutada por orden del agente.';
        } else {
          result.feedback = 'Node.js ejecutándose sin --expose-gc, reinicio de métricas simulado.';
        }
        result.executed = true;
        break;

      default:
        result.feedback = `Acción desconocida: ${directive.action}`;
    }

    return result;
  }
}

// Permitir prueba directa desde la terminal
if (require.main === module) {
  const listener = new AgentListener();
  listener.checkIncomingDirectives();
}

module.exports = AgentListener;
