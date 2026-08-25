/**
 * Módulo de Utilidades y Habilidades de Cálculo - Ra Pulse
 * Actualizado para soportar múltiples operaciones y exportación modular.
 */

function calculateNumbers(var1, var2, operacion = 'suma') {
    switch (operacion) {
        case 'suma':
            return var1 + var2;
        case 'resta':
            return var1 - var2;
        case 'multiplicacion':
            return var1 * var2;
        case 'division':
            if (var2 === 0) throw new Error("División por cero no permitida");
            return var1 / var2;
        default:
            return var1 + var2;
    }
}

module.exports = { calculateNumbers };
