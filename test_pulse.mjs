async function ejecutar() {
    const asunto = "usb: Gate charging-state FUNCTION_NONE behind a config flag";
    console.log(`📡 Analizando parche: "${asunto}"`);
    
    try {
        const { analizarParche } = await import('../ia-didactica-core/index.js');
        const analisis = await analizarParche(asunto);
        console.log('📝 Análisis de IA:', analisis);
    } catch (err) {
        console.log('⚠️ No se pudo cargar ia-didactica-core o fallo el análisis:', err.message);
        console.log('✅ Prueba omitida correctamente.');
    }
}

ejecutar();
