/**
 * Core Mutator-Emulator Protocol v1.0
 * Context: ia-didactica-core (@moranricardo)
 */

class MutatorEmulator {
    constructor(baseState = {}) {
        this.baseState = Object.freeze({ ...baseState });
        this.activeMutation = null;
    }

    injectMutation(mutationDelta) {
        this.activeMutation = {
            timestamp: Date.now(),
            delta: mutationDelta,
            ephemeralState: { ...this.baseState, ...mutationDelta }
        };
        return this.activeMutation.ephemeralState;
    }

    emulateContext(evaluatorFn) {
        if (!this.activeMutation) {
            throw new Error("[Emulator Exception] No active mutation detected.");
        }
        return {
            status: "EMULATED",
            output: evaluatorFn(this.activeMutation.ephemeralState)
        };
    }

    rollback() {
        this.activeMutation = null;
        return { status: "CLEAN_LAYER_3", currentState: { ...this.baseState } };
    }
}

module.exports = MutatorEmulator;
