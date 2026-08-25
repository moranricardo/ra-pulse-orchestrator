/**
 * Core Mutator-Emulator Protocol v1.1 (Optimized for Termux/Node.js)
 * Context: ia-didactica-core (@moranricardo)
 */
const fs = require('fs');
const path = require('path');

class MutatorEmulator {
    constructor(baseState = {}) {
        this.baseState = Object.freeze({ ...baseState });
        this.activeMutation = null;
        this.logDir = path.join(process.env.HOME || '.', 'proyectos', 'snapshots');
        this.logPath = path.join(this.logDir, 'mutations_js.log');
        this._initStorage();
    }

    _initStorage() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    injectMutation(mutationDelta) {
        this.activeMutation = {
            timestamp: new Date().toISOString(),
            delta: mutationDelta,
            ephemeralState: { ...this.baseState, ...mutationDelta }
        };
        this._persistLog("INJECT", this.activeMutation);
        return this.activeMutation.ephemeralState;
    }

    emulateContext(evaluatorFn) {
        if (!this.activeMutation) {
            throw new Error("[Emulator Exception] No active mutation detected.");
        }
        const output = evaluatorFn(this.activeMutation.ephemeralState);
        this._persistLog("EMULATE", { output });
        return {
            status: "EMULATED",
            output: output
        };
    }

    rollback() {
        this._persistLog("ROLLBACK", { status: "CLEAN_LAYER_3" });
        this.activeMutation = null;
        return { status: "CLEAN_LAYER_3", currentState: { ...this.baseState } };
    }

    _persistLog(action, data) {
        const logEntry = `[${new Date().toISOString()}] | ACTION: ${action} | DATA: ${JSON.stringify(data)}\n`;
        try {
            fs.appendFileSync(this.logPath, logEntry, 'utf8');
        } catch (err) {
            console.error("[Storage Error] No se pudo escribir en el dispositivo:", err.message);
        }
    }
}

module.exports = MutatorEmulator;
