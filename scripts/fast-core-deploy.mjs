import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, '..', 'out');
const coreZip = path.resolve(__dirname, '..', 'core.zip');
const phpScript = path.resolve(__dirname, '..', 'unzip-core.php');

if (fs.existsSync(coreZip)) fs.unlinkSync(coreZip);
execSync(`tar -acf "${coreZip}" --exclude="jobs" -C "${outDir}" .`, { stdio: 'inherit' });
console.log(`✅ core.zip created (${(fs.statSync(coreZip).size / (1024 * 1024)).toFixed(2)} MB)`);

const phpCode = `<?php
header('Content-Type: text/plain');
ignore_user_abort(true);
set_time_limit(0);
ini_set('memory_limit', '512M');

$z1 = new ZipArchive;
if ($z1->open('core.zip') === TRUE) {
    $z1->extractTo(__DIR__);
    $z1->close();
    @unlink('core.zip');
    echo "CORE_OK\\n";
}
@unlink(__FILE__);
?>`;
fs.writeFileSync(phpScript, phpCode);

const ftpUser = 'u609361508.clinicstaffjobs.com';
const ftpPass = 'Karachi12!!@@';
const ftpHost = '31.170.166.176';

execSync(`curl.exe -s -T "${coreZip}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/core.zip"`, { stdio: 'inherit' });
execSync(`curl.exe -s -T "${phpScript}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/unzip-core.php"`, { stdio: 'inherit' });
const res = execSync(`curl.exe -s -L -k "https://clinicstaffjobs.com/unzip-core.php"`, { encoding: 'utf-8' });
console.log('Server response:', res);

if (fs.existsSync(coreZip)) fs.unlinkSync(coreZip);
if (fs.existsSync(phpScript)) fs.unlinkSync(phpScript);
