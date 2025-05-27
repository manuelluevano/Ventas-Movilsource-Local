#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuración
const OUTPUT_FILE = path.join(__dirname, '../src/commit-info.json');

function getGitInfo() {
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

function getVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    return packageJson.version || '0.0.0';
  } catch {
    try {
      return execSync('git describe --tags --always 2>/dev/null').toString().trim() || '0.0.0';
    } catch {
      return '0.0.0';
    }
  }
}

function generateCommitInfo() {
  const gitInfo = getGitInfo();
  const version = getVersion();

  const commitInfo = {
    version,
    ...gitInfo,
    buildDate: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(commitInfo, null, 2));
    console.log(`✅ ${OUTPUT_FILE} actualizado correctamente`);
  } catch (error) {
    console.error(`❌ Error escribiendo ${OUTPUT_FILE}:`, error.message);
    process.exit(1);
  }
}

generateCommitInfo();