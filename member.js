/**
 * Módulo de Gestión de Miembros y Perfiles - Ra Pulse
 * Actualizado para soportar datos dinámicos y exportación robusta.
 */

function skillsMember(nombre = 'Ricardo', habilidades = ['JavaScript', 'Node.js', 'GitHub Copilot', 'Orquestación']) {
    return {
        role: 'Orchestrator Lead',
        name: nombre,
        skills: habilidades,
        last_updated: new Date().toISOString()
    };
}

module.exports = { skillsMember };
