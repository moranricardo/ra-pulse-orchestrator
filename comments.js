/**
 * Módulo de Servidor Web y Gestión de Comentarios
 * Actualizado para soporte de rutas seguras y manejo de errores.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 3000;
try {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (configData.port) PORT = configData.port;
    }
} catch (error) {
    console.warn('⚠️ No se pudo leer config.json, usando puerto por defecto:', PORT);
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'success',
            message: 'RA-Pulse Orchestrator Web Server Active',
            timestamp: new Date().toISOString()
        }));
    } 
    else if (req.url === '/comments' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            comments: [
                { id: 1, author: 'Ricardo', comment: 'Sistema de orquestación inicializado correctamente.' }
            ]
        }));
    } 
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor web ejecutándose en http://localhost:${PORT}`);
});
