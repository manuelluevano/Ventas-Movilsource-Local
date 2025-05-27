const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

try {
  // Obtener información detallada del commit
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
  const commitDate = execSync('git log -1 --pretty=%cd --date=iso').toString().trim();
  const commitAuthor = execSync('git log -1 --pretty=%an').toString().trim();
  
  // Obtener versión del package.json o usar git describe
  let version;
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    version = packageJson.version;
  } catch {
    version = execSync('git describe --tags --always').toString().trim();
  }

  // Datos estructurados para el JSON
  const commitInfo = {
    message: commitMessage,
    version: version,
    date: commitDate,
    hash: commitHash,
    author: commitAuthor,
    buildDate: new Date().toISOString()
  };

  // Asegurar que el directorio destino existe
  const outputDir = path.dirname('./src/commit-info.json');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Escribir el archivo con formato legible
  fs.writeFileSync(
    './src/commit-info.json',
    JSON.stringify(commitInfo, null, 2) + '\n' // Newline al final para mejor diffs
  );

  console.log('ℹ️ commit-info.json actualizado con éxito');
} catch (error) {
  console.error('⚠️ Error al generar commit-info.json:', error.message);
  process.exit(1);
}