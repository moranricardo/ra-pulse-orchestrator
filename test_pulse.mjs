import { analizarParche } from '../ia-didactica-core/index.js';

async function ejecutar() {
    const asunto = "usb: Gate charging-state FUNCTION_NONE behind a config flag";
    console.log(`📡 Analizando parche: "${asunto}"`);
    const analisis = await analizarParche(asunto);
    console.log('📝 Análisis de IA:', analisis);
}

ejecutar();
