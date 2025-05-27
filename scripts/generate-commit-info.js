#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuración de rutas para ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = join(__dirname, '../commit-info.json');

async function getGitInfo() {
  try {
    return {
      hash: execSync('git rev-parse --short HEAD 2>/dev/null').toString().trim() || 'unknown',
      message: execSync('git log -1 --pretty=%B 2>/dev/null').toString().trim() || 'No commit message',
      date: execSync('git log -1 --pretty=%cd --date=iso 2>/dev/null').toString().trim() || new Date().toISOString(),
      author: execSync('git log -1 --pretty=%an 2>/dev/null').toString().trim() || 'unknown',
      branch: execSync('git branch --show-current 2>/dev/null').toString().trim() || 'unknown'
    };
  } catch (error) {
    console.error('Error obteniendo información de Git:', error.message);
    return {
      hash: 'unknown',
      message: 'Git not available',
      date: new Date().toISOString(),
      author: 'system',
      branch: 'unknown'
    };
  }
}

async function getVersion() {
  try {
    const packageJson = JSON.parse(await readFile('./package.json', 'utf-8'));
    return packageJson.version || '0.0.0';
  } catch {
    try {
      return execSync('git describe --tags --always 2>/dev/null').toString().trim() || '0.0.0';
    } catch {
      return '0.0.0';
    }
  }
}

// Polyfill para readFile en ES Modules
async function readFile(path, encoding) {
  const { readFile } = await import('fs/promises');
  return readFile(path, encoding);
}

async function generateCommitInfo() {
  const gitInfo = await getGitInfo();
  const version = await getVersion();

  const commitInfo = {
    version,
    ...gitInfo,
    buildDate: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    writeFileSync(OUTPUT_FILE, JSON.stringify(commitInfo, null, 2));
    console.log(`✅ ${OUTPUT_FILE} actualizado correctamente`);
  } catch (error) {
    console.error(`❌ Error escribiendo ${OUTPUT_FILE}:`, error.message);
    process.exit(1);
  }
}

generateCommitInfo();