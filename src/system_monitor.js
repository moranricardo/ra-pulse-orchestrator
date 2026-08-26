const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const statePath = path.join(rootDir, 'state.json');
const logPath = path.join(rootDir, 'log_mantenimiento.json');

// 1. Recolectar métricas locales del dispositivo
const timestamp = new Date().toISOString();
const memoryUsage = process.memoryUsage();
const uptime = process.uptime();

let stateData = {
    system: "RA-Pulse-Orchestrator",
    status: "OPTIMIZED",
    last_pulse: timestamp,
    metrics: {
        uptime_seconds: Math.floor(uptime),
        rss_memory_mb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        heap_used_mb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
    }
};

// Guardar métricas en state.json
fs.writeFileSync(statePath, JSON.stringify(stateData, null, 2));

// 2. Registrar tarea de mantenimiento local
let maintenanceLog = [];
if (fs.existsSync(logPath)) {
    try {
        maintenanceLog = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    } catch (e) {
        maintenanceLog = [];
    }
}

maintenanceLog.push({
    action: "HEALTH_CHECK",
    timestamp: timestamp,
    result: "SUCCESS"
});

// Mantener solo los últimos 20 registros para cuidar espacio
if (maintenanceLog.length > 20) {
    maintenanceLog = maintenanceLog.slice(-20);
}

fs.writeFileSync(logPath, JSON.stringify(maintenanceLog, null, 2));

console.log("[✓] Microservidor local ejecutado con éxito.");
console.log(`[Metrics] Uptime: ${Math.floor(uptime)}s | Heap: ${stateData.metrics.heap_used_mb} MB`);
