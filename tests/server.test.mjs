import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn } from 'node:child_process';
import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 4100 + Math.floor(Math.random() * 500);
const dataDir = await mkdtemp(join(tmpdir(), 'observatorio-emendas-'));
const dataFile = join(dataDir, 'emendas.json');
let server;

before(async () => {
  await copyFile('data/emendas.json', dataFile);
  server = spawn(process.execPath, ['server.js'], { env: { ...process.env, PORT: String(port), DATA_FILE: dataFile } });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Servidor não iniciou')), 5000);
    server.stdout.on('data', output => { if (output.toString().includes('disponível')) { clearTimeout(timeout); resolve(); } });
    server.on('error', reject);
  });
});
after(async () => { server?.kill(); await rm(dataDir, { recursive: true, force: true }); });

test('expõe a configuração dos nove municípios da Baixada Santista', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/api/config`);
  const config = await response.json();
  assert.equal(response.status, 200);
  assert.equal(config.municipios.length, 9);
  assert.ok(config.municipios.includes('Santos'));
});

test('protege a administração sem sessão autenticada', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/api/admin/emendas`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 401);
});
