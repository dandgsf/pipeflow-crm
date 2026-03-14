/**
 * ensure-next-junction.mjs
 *
 * Garante que .next seja um junction point apontando para
 * %LOCALAPPDATA%\pipeflow-crm\.next  (fora do OneDrive).
 *
 * Por que junction e não distDir externo?
 *   - distDir fora do projeto quebra a resolução de módulos do Next.js
 *   - OneDrive não sincroniza o conteúdo de junctions (trata como atalho)
 *   - Next.js enxerga .next normalmente (sem EINVAL)
 *
 * Roda automaticamente via "predev" e "prebuild" em package.json.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const projectRoot = process.cwd();
const nextDir = path.join(projectRoot, ".next");
const localTarget = path.join(os.homedir(), "AppData", "Local", "pipeflow-crm", ".next");

// 1. Garante que o diretório de destino existe
fs.mkdirSync(localTarget, { recursive: true });

// 2. Se .next já é um junction válido apontando para o destino correto → ok
try {
  const stat = fs.lstatSync(nextDir);
  if (stat.isSymbolicLink() || (process.platform === "win32" && isJunction(nextDir))) {
    const target = fs.readlinkSync(nextDir);
    if (path.resolve(target) === path.resolve(localTarget)) {
      console.log("[predev] .next junction OK →", localTarget);
      process.exit(0);
    }
    // Junction aponta para lugar errado — remove
    fs.rmdirSync(nextDir);
  } else if (stat.isDirectory()) {
    // É uma pasta real (OneDrive sincronizou) — remove recursivamente
    console.log("[predev] Removendo .next real (OneDrive)...");
    fs.rmSync(nextDir, { recursive: true, force: true });
  }
} catch {
  // .next não existe — tudo bem, cria o junction abaixo
}

// 3. Cria o junction (mklink /J no Windows)
try {
  execSync(`cmd /c mklink /J "${nextDir}" "${localTarget}"`, { stdio: "pipe" });
  console.log("[predev] Junction criado: .next →", localTarget);
} catch (err) {
  console.warn("[predev] Falha ao criar junction:", err.message);
  console.warn("[predev] Continuando sem junction — pode haver EINVAL se OneDrive sincronizar .next");
}

function isJunction(dirPath) {
  try {
    // No Windows, junctions têm atributo de reparse point
    const stat = fs.lstatSync(dirPath);
    // lstat retorna isSymbolicLink=false para junctions em versões antigas do Node
    // mas fs.readlinkSync funciona para ambos
    fs.readlinkSync(dirPath);
    return true;
  } catch {
    return false;
  }
}
