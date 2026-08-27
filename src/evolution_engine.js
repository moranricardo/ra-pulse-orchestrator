const fs = require('fs');
const path = require('path');

function processEvolutionPatch() {
  const patchPath = path.join(__dirname, '../code_patch.json');
  
  if (!fs.existsSync(patchPath)) {
    return { applied: false, reason: 'No patch found' };
  }

  try {
    const rawData = fs.readFileSync(patchPath, 'utf8');
    const patch = JSON.parse(rawData);

    console.log(`🧬 [EvolutionEngine] Parche detectado de: ${patch.signature}`);

    const targetPath = path.join(__dirname, '..', patch.target_module);
    if (!fs.existsSync(targetPath)) {
      fs.unlinkSync(patchPath);
      return { applied: false, reason: 'Target module not found' };
    }

    // Validación estática básica simulada mediante Function constructor (sandbox de sintaxis)
    new Function(patch.payload);

    // Aplicar reemplazo o inyección controlada
    fs.writeFileSync(targetPath, patch.payload, 'utf8');
    
    // Limpiar archivo de parche procesado
    fs.unlinkSync(patchPath);
    console.log(`✅ [EvolutionEngine] Parche aplicado y validado con éxito.`);
    
    return { applied: true, target: patch.target_module };
  } catch (error) {
    console.error(`❌ [EvolutionEngine] Error al validar o aplicar el parche: ${error.message}`);
    if (fs.existsSync(patchPath)) {
      fs.unlinkSync(patchPath); // Limpiar parche corrupto
    }
    return { applied: false, reason: error.message };
  }
}

module.exports = { processEvolutionPatch };
