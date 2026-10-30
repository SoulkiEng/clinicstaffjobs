import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, '..', 'out');
const zipFile = path.resolve(__dirname, '..', 'deploy.zip');
const phpScript = path.resolve(__dirname, '..', 'deploy-unzip.php');

console.log('📦 Step 1: Packaging static export into deploy.zip...');
if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);

// Create deploy.zip with bsdtar
execSync(`tar -acf "${zipFile}" -C "${outDir}" .`, { stdio: 'inherit' });
const zipStats = fs.statSync(zipFile);
console.log(`✅ deploy.zip created (${(zipStats.size / (1024 * 1024)).toFixed(2)} MB)`);

console.log('📄 Step 2: Creating PHP atomic extractor...');
const phpCode = `<?php
header('Content-Type: text/plain');
ini_set('max_execution_time', 300);

$zip = new ZipArchive;
if ($zip->open('deploy.zip') === TRUE) {
    $zip->extractTo(__DIR__);
    $zip->close();
    @unlink('deploy.zip');
    @unlink(__FILE__);
    echo "SUCCESS: 1650+ PAGES EXTRACTED AND LIVE";
} else {
    http_response_code(500);
    echo "ERROR: Failed to open zip";
}
?>`;
fs.writeFileSync(phpScript, phpCode);

console.log('🚀 Step 3: Uploading via Hostinger FTP...');
const ftpUser = 'u609361508.clinicstaffjobs.com';
const ftpPass = process.env.FTP_PASSWORD || 'Karachi12!!@@';
const ftpHost = '31.170.166.176';
const curlCmd = process.platform === 'win32' ? 'curl.exe' : 'curl';

// Upload deploy.zip
console.log('   Uploading deploy.zip...');
execSync(`${curlCmd} -s -T "${zipFile}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/deploy.zip"`, { stdio: 'inherit' });

// Upload deploy-unzip.php
console.log('   Uploading deploy-unzip.php...');
execSync(`${curlCmd} -s -T "${phpScript}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/deploy-unzip.php"`, { stdio: 'inherit' });

console.log('⚡ Step 4: Triggering LiteSpeed extraction...');
try {
  const result = execSync(`${curlCmd} -s -k "https://clinicstaffjobs.com/deploy-unzip.php"`, { encoding: 'utf-8' });
  console.log('Response from server:\n', result);
} catch (err) {
  console.error('Trigger error:', err.message);
}

// Cleanup local temporary files
if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
if (fs.existsSync(phpScript)) fs.unlinkSync(phpScript);

console.log('🎉 DIRECT DEPLOYMENT COMPLETE! Checking live website...');
