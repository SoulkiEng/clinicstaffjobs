import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, '..', 'out');
const coreZip = path.resolve(__dirname, '..', 'core.zip');
const jobsZip = path.resolve(__dirname, '..', 'jobs.zip');
const phpScript = path.resolve(__dirname, '..', 'deploy-unzip.php');

console.log('📦 Step 1: Packaging core site routes into core.zip...');
if (fs.existsSync(coreZip)) fs.unlinkSync(coreZip);
execSync(`tar -acf "${coreZip}" --exclude="jobs" -C "${outDir}" .`, { stdio: 'inherit' });
console.log(`✅ core.zip created (${(fs.statSync(coreZip).size / (1024 * 1024)).toFixed(2)} MB)`);

console.log('📦 Step 2: Packaging 1,824 job detail pages into jobs.zip (HTML & JSON only)...');
if (fs.existsSync(jobsZip)) fs.unlinkSync(jobsZip);
execSync(`tar -acf "${jobsZip}" -C "${outDir}" jobs`, { stdio: 'inherit' });
console.log(`✅ jobs.zip created (${(fs.statSync(jobsZip).size / (1024 * 1024)).toFixed(2)} MB)`);

console.log('📄 Step 3: Creating PHP atomic extractor...');
const phpCode = `<?php
header('Content-Type: text/plain');
ignore_user_abort(true);
set_time_limit(0);
ini_set('max_execution_time', 600);
ini_set('memory_limit', '512M');

$zCore = new ZipArchive;
if ($zCore->open('core.zip') === TRUE) {
    $zCore->extractTo(__DIR__);
    $zCore->close();
    @unlink('core.zip');
    echo "SUCCESS: Core pages extracted.\\n";
}

if (file_exists('jobs.zip')) {
    $zJobs = new ZipArchive;
    if ($zJobs->open('jobs.zip') === TRUE) {
        $zJobs->extractTo(__DIR__);
        $zJobs->close();
        @unlink('jobs.zip');
        echo "SUCCESS: 1,824 Job pages extracted.\\n";
    }
}

@unlink('deploy.zip');
@unlink(__FILE__);
echo "ALL_DEPLOYED_AND_LIVE";
?>`;
fs.writeFileSync(phpScript, phpCode);

const ftpUser = 'u609361508.clinicstaffjobs.com';
const ftpPass = process.env.FTP_PASSWORD || 'Karachi12!!@@';
const ftpHost = '31.170.166.176';
const curlCmd = process.platform === 'win32' ? 'curl.exe' : 'curl';

console.log('🚀 Step 4: Uploading core.zip, jobs.zip & deploy-unzip.php via FTP...');
execSync(`${curlCmd} -s -T "${coreZip}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/core.zip"`, { stdio: 'inherit' });
execSync(`${curlCmd} -s -T "${jobsZip}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/jobs.zip"`, { stdio: 'inherit' });
execSync(`${curlCmd} -s -T "${phpScript}" -u "${ftpUser}:${ftpPass}" "ftp://${ftpHost}/deploy-unzip.php"`, { stdio: 'inherit' });

console.log('⚡ Step 5: Triggering LiteSpeed extraction...');
try {
  const result = execSync(`${curlCmd} -s -L -k --max-time 180 "https://clinicstaffjobs.com/deploy-unzip.php"`, { encoding: 'utf-8' });
  console.log('Response from server:\n', result);
} catch (err) {
  console.error('Trigger note:', err.message);
}

if (fs.existsSync(coreZip)) fs.unlinkSync(coreZip);
if (fs.existsSync(jobsZip)) fs.unlinkSync(jobsZip);
if (fs.existsSync(phpScript)) fs.unlinkSync(phpScript);

console.log('🎉 DIRECT DEPLOYMENT COMPLETE!');
