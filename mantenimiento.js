/**
 * Módulo de Gestión y Registro de Mantenimiento - Ra Pulse
 * Actualizado con límite de seguridad para evitar desbordamiento del log.
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'log_mantenimiento.json');
const MAX_LOG_RECORDS = 100;

function registrarMantenimiento(accion, detalles) {
    let logData = {
        last_maintenance: new Date().toISOString(),
        total_records: 0,
        logs: []
    };

    try {
        if (fs.existsSync(LOG_FILE)) {
            const contenido = fs.readFileSync(LOG_FILE, 'utf8');
            if (contenido.trim()) {
                logData = JSON.parse(contenido);
            }
        }
    } catch (error) {
        console.warn('⚠️ No se pudo leer el log anterior, creando uno nuevo.');
    }

    const nuevoRegistro = {
        timestamp: new Date().toISOString(),
        action: accion,
        details: detalles
    };

    logData.logs.push(nuevoRegistro);

    if (logData.logs.length > MAX_LOG_RECORDS) {
        logData.logs = logData.logs.slice(-MAX_LOG_RECORDS);
    }

    logData.total_records = logData.logs.length;
    logData.last_maintenance = new Date().toISOString();

    try {
        fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));
        console.log(`✅ Mantenimiento registrado correctamente en ${LOG_FILE}`);
    } catch (error) {
        console.error(`🚨 Error al guardar el log de mantenimiento: ${error.message}`);
    }
}

if (require.main === module) {
    registrarMantenimiento("SYSTEM_AUDIT", "Ejecución de rutina de mantenimiento y verificación de estado con límite optimizado.");
}

module.exports = { registrarMantenimiento };
