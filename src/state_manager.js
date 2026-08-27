const fs = require('fs');
const path = require('path');

const STATE_FILE_PATH = path.join(__dirname, '../state.json');

class StateManager {
  constructor() {
    this.defaultState = {
      lastRun: null,
      executionCount: 0,
      status: 'INITIALIZED',
      lastError: null
    };
  }

  loadState() {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const rawData = fs.readFileSync(STATE_FILE_PATH, 'utf8');
        return JSON.parse(rawData);
      }
    } catch (error) {
      console.error('Error al leer el state.json:', error.message);
    }
    return { ...this.defaultState };
  }

  updateState(newData) {
    try {
      const currentState = this.loadState();
      const newState = {
        ...currentState,
        ...newData,
        lastRun: new Date().toISOString(),
        executionCount: (currentState.executionCount || 0) + 1
      };

      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(newState, null, 2), 'utf8');
      return newState;
    } catch (error) {
      console.error('Error al escribir en state.json:', error.message);
      return null;
    }
  }
}

module.exports = StateManager;
