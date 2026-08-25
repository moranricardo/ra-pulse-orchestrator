#!/usr/bin/env bash

INTERVAL=300
LOG_FILE="./pulse.log"
LOCK_FILE="/tmp/ra_pulse_daemon.lock"

if [ -f "$LOCK_FILE" ]; then
    echo "⚠️ El demonio [Ra Pulse] ya se encuentra en ejecución (PID: $(cat "$LOCK_FILE"))."
    exit 1
fi

echo $$ > "$LOCK_FILE"

cleanup() {
    echo -n "[$(date '+%Y-%m-%d %H:%M:%S')] Deteniendo demonio [Ra Pulse]..." | tee -a "$LOG_FILE"
    rm -f "$LOCK_FILE"
    echo " [OK]"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "🚀 Lanzando Demonio [Ra Pulse] en segundo plano (PID: $$)..."
echo "📊 Monitoreando ecosistemas cada $INTERVAL segundos."
echo "📝 Los registros de salida se guardarán en: $LOG_FILE"

while true; do
  if [ -f "index.js" ]; then
      echo "[$(date '+%Y-%m-%d %H:%M:%S')] Executing cron pulse..." >> "$LOG_FILE"
      node index.js >> "$LOG_FILE" 2>&1
  else
      echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Error: No se encontró index.js en el directorio actual." >> "$LOG_FILE"
  fi

  sleep "$INTERVAL"
done
