import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://clinicstaffjobs.com';
const jobsPath = path.resolve('clinicstaffjobs/data/all_jobs.json');
const publicDir = path.resolve('clinicstaffjobs/public');

const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
const today = new Date().toISOString().split('T')[0];

const coreRoutes = [
  { url: '/', priority: '1.0', changefreq: 'hourly' },
  { url: '/post-a-job/', priority: '0.9', changefreq: 'daily' },
  { url: '/employers/', priority: '0.9', changefreq: 'weekly' },
  { url: '/career-resources/', priority: '0.9', changefreq: 'weekly' },
  { url: '/salary-calculator/', priority: '0.9', changefreq: 'weekly' },
  { url: '/alerts/', priority: '0.8', changefreq: 'weekly' },
  { url: '/login/', priority: '0.6', changefreq: 'monthly' },
  { url: '/signup/', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy/', priority: '0.5', changefreq: 'monthly' },
  { url: '/terms/', priority: '0.5', changefreq: 'monthly' },
];

const xmlEntries = [];

for (const route of coreRoutes) {
  xmlEntries.push(
    `  <url>\n    <loc>${SITE_URL}${route.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
  );
}

for (const job of jobs) {
  xmlEntries.push(
    `  <url>\n    <loc>${SITE_URL}/jobs/${job.id}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
  );
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries.join('\n')}\n</urlset>\n`;

const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

console.log(`✅ Generated sitemap.xml (${xmlEntries.length} URLs) and robots.txt in public/`);
