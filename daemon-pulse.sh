#!/bin/bash
echo "[*] Iniciando demonio autónomo de RA-Pulse-Orchestrator..."
echo "[*] Presiona Ctrl+C para detenerlo."

while true; do
    node src/system_monitor.js
    echo "[*] Pulso sincronizado. Esperando 300 segundos (5 minutos)..."
    sleep 300
done
