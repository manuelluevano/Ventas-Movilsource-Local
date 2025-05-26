// scripts/save-commit-info.js
const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Obtener el último commit
  const commitHash = execSync('git rev-parse HEAD').toString().trim();
  const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
  const commitAuthor = execSync('git log -1 --pretty=%an').toString().trim();
  const commitDate = execSync('git log -1 --pretty=%cd').toString().trim();

  // Crear un objeto con la información
  const commitInfo = {
    hash: commitHash,
    message: commitMessage,
    author: commitAuthor,
    date: commitDate,
  };

  // Guardar en un archivo JSON
  fs.writeFileSync('commit-info.json', JSON.stringify(commitInfo, null, 2));
  console.log('✅ Información del commit guardada en commit-info.json');
} catch (error) {
  console.error('❌ Error al guardar la información del commit:', error.message);
}