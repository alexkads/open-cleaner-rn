#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Atualiza as versões automaticamente baseado na tag Git
 */
function updateVersions() {
  try {
    // Pega a versão da tag Git atual ou gera baseada em commits
    let version;
    
    try {
      // Tenta pegar a tag atual
      version = execSync('git describe --tags --exact-match HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
      // Remove o 'v' se existir
      version = version.replace(/^v/, '');
      console.log(`📏 Usando versão da tag: ${version}`);
    } catch {
      try {
        // Se não há tag, pega a última tag e adiciona numero de commits
        const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf8' }).trim().replace(/^v/, '');
        const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
        const shortHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        version = `${lastTag}-dev.${commitCount}+${shortHash}`;
        console.log(`🔧 Gerando versão de desenvolvimento: ${version}`);
      } catch {
        // Se não há tags, usa versão baseada em commits
        const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
        const shortHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        version = `0.1.0-dev.${commitCount}+${shortHash}`;
        console.log(`🆕 Primeira versão: ${version}`);
      }
    }

    // Atualiza package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ package.json atualizado para ${version}`);

    // Atualiza Cargo.toml
    const cargoTomlPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml');
    let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
    cargoToml = cargoToml.replace(/version = ".*?"/, `version = "${version}"`);
    fs.writeFileSync(cargoTomlPath, cargoToml);
    console.log(`✅ Cargo.toml atualizado para ${version}`);

    // Atualiza tauri.conf.json
    const tauriConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
    const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
    tauriConf.version = version;
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
    console.log(`✅ tauri.conf.json atualizado para ${version}`);

    // Atualiza tauri.release.conf.json se existir
    const tauriReleaseConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.release.conf.json');
    if (fs.existsSync(tauriReleaseConfPath)) {
      const tauriReleaseConf = JSON.parse(fs.readFileSync(tauriReleaseConfPath, 'utf8'));
      tauriReleaseConf.version = version;
      fs.writeFileSync(tauriReleaseConfPath, JSON.stringify(tauriReleaseConf, null, 2) + '\n');
      console.log(`✅ tauri.release.conf.json atualizado para ${version}`);
    }

    console.log(`\n🎉 Todas as versões foram atualizadas para: ${version}`);
    return version;

  } catch (error) {
    console.error('❌ Erro ao atualizar versões:', error.message);
    process.exit(1);
  }
}

// Executa apenas se chamado diretamente
if (require.main === module) {
  updateVersions();
}

module.exports = { updateVersions };