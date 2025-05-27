// scripts/generate-commit-info.js
const fs = require('fs');
const { execSync } = require('child_process');

// Obtener información del último commit
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
const commitDate = execSync('git log -1 --pretty=%cd --date=short').toString().trim();

// Obtener versión del package.json (opcional)
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const version = packageJson.version || '1.0.0';

// Datos a guardar en commit-info.json
const commitInfo = {
  message: commitMessage,
  version: version,
  date: commitDate,
  hash: commitHash,
};

// Guardar en el archivo JSON
fs.writeFileSync('./src/commit-info.json', JSON.stringify(commitInfo, null, 2));

console.log('✅ commit-info.json actualizado');