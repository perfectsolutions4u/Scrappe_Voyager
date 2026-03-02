#!/usr/bin/env node
/**
 * Blueprint scaffold script.
 * Copies this Angular project to a new directory and replaces project name + SEO placeholders.
 *
 * Usage:
 *   node scripts/scaffold.js --config scaffold.config.json --out ../new-project
 *   node scripts/scaffold.js --out ../new-project
 *
 * Default config path: scaffold.config.json (in repo root).
 * Default out: ../<slug> (from config).
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_CONFIG_PATH = path.join(REPO_ROOT, 'scaffold.config.json');
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'out-tsc', '.angular', 'coverage', 'docs']);
const IGNORE_FILES = new Set(['package-lock.json', 'scaffold.config.json']);

function parseArgs() {
  const args = process.argv.slice(2);
  let configPath = DEFAULT_CONFIG_PATH;
  let outDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = path.isAbsolute(args[i + 1]) ? args[i + 1] : path.join(REPO_ROOT, args[i + 1]);
      i++;
    } else if (args[i] === '--out' && args[i + 1]) {
      outDir = path.isAbsolute(args[i + 1]) ? args[i + 1] : path.join(REPO_ROOT, args[i + 1]);
      i++;
    }
  }
  return { configPath, outDir };
}

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    console.error('Config not found:', configPath);
    console.error('Copy blueprint/scaffold.config.example.json to scaffold.config.json and edit it.');
    process.exit(1);
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw);
}

function slugToKebab(slug) {
  return slug.replace(/_/g, '-');
}

function copyRecursive(src, dest, replacements, slug, displayName, displayNameLower, seo, contact, apiUrl) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (IGNORE_DIRS.has(path.basename(src))) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(
        path.join(src, name),
        path.join(dest, name),
        replacements,
        slug,
        displayName,
        displayNameLower,
        seo,
        contact,
        apiUrl
      );
    }
    return;
  }
  if (IGNORE_FILES.has(path.basename(src))) return;
  const ext = path.extname(src).toLowerCase();
  const isText = ['.ts', '.html', '.json', '.scss', '.css', '.md', '.yml', '.yaml'].includes(ext);
  let content = fs.readFileSync(src, isText ? 'utf8' : undefined);
  if (isText && content) {
    for (const [from, to] of replacements) {
      if (typeof to === 'string' && content.includes(from)) {
        content = content.split(from).join(to);
      }
    }
  }
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(dest, content || fs.readFileSync(src), isText ? 'utf8' : undefined);
}

function buildReplacements(config) {
  const slug = config.slug || config.projectName.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const displayName = config.projectName || slug.replace(/_/g, ' ');
  const displayNameLower = displayName.toLowerCase();
  const kebab = slugToKebab(slug);
  const seo = config.seo || {};
  const contact = config.contact || {};
  const apiUrl = config.apiUrl || 'https://tourism-api.perfectsolutions4u.com/api';

  const replacements = [
    ['scrappe_voyager', slug],
    ['Scrappe Voyager', displayName],
    ['scrappe voyager', displayNameLower],
    ['Scrappe Voyager Egypt', displayName + ' Egypt'],
    ['scrappevoyager', slug.replace(/_/g, '')],
    ['scrappe-voyager', kebab],
    ['scrappe-voyager-logo.webp', kebab + '-logo.webp'],
    ['info@scrappevoyager.com', contact.email || `info@${slug.replace(/_/g, '')}.com`],
    ['Scrappe Voyager Travel - Home', (seo.defaultTitle || displayName) + ' Travel - Home'],
    ['Discover amazing tours and travel experiences with Scrappe Voyager. Book your dream vacation today.', seo.defaultDescription || 'Discover amazing tours and travel experiences with ' + displayName + '. Book your dream vacation today.'],
    ['Discover amazing tours and travel experiences with Scrappe Voyager Travel. Book your dream vacation today.', (seo.defaultDescription || '').replace(displayName, displayName + ' Travel') || 'Discover amazing tours and travel experiences with ' + displayName + ' Travel. Book your dream vacation today.'],
    ['https://tourism-api.perfectsolutions4u.com/api', apiUrl],
  ];

  if (seo.defaultTitle) {
    replacements.push(['Scrappe Voyager', seo.defaultTitle]);
  }
  if (seo.defaultDescription) {
    replacements.push(['Discover amazing tours and travel experiences with Scrappe Voyager. Book your dream vacation today.', seo.defaultDescription]);
  }
  if (seo.siteUrl) {
    replacements.push(['this.siteUrl = \'https://tourism-api.perfectsolutions4u.com/api\'', `this.siteUrl = '${seo.siteUrl}'`]);
    replacements.push(['this.siteUrl = \'https://tourism-api.perfectsolutions4u.com/api\';', `this.siteUrl = '${seo.siteUrl}';`]);
  }
  replacements.push([
    'private defaultTitle = \'Scrappe Voyager\';',
    `private defaultTitle = '${(seo.defaultTitle || displayName).replace(/'/g, "\\'")}';`
  ]);
  replacements.push([
    '\'Discover amazing tours and travel experiences with Scrappe Voyager. Book your dream vacation today.\';',
    `'${(seo.defaultDescription || 'Discover amazing tours and travel experiences with ' + displayName + '. Book your dream vacation today.').replace(/'/g, "\\'")}';`
  ]);
  if (contact.mapUrl) {
    replacements.push(['https://www.google.com/maps/place/Scrappe+Voyager/@30.0641303,31.229112,15z/data=!4m6!3m5!1s0x14583fa60b21be71:0x75686b8d4c537a8f!8m2!3d30.0641303!4d31.229112!16s%2Fg%2F11c400czgr?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D', contact.mapUrl]);
  }

  return { replacements, slug, displayName, displayNameLower, seo, contact, apiUrl };
}

function main() {
  const { configPath, outDir } = parseArgs();
  const config = loadConfig(configPath);
  const { replacements, slug, displayName, displayNameLower, seo, contact, apiUrl } = buildReplacements(config);
  const targetDir = outDir || path.join(REPO_ROOT, '..', slug);
  if (fs.existsSync(targetDir)) {
    console.error('Target directory already exists:', targetDir);
    process.exit(1);
  }
  console.log('Scaffolding to', targetDir);
  copyRecursive(REPO_ROOT, targetDir, replacements, slug, displayName, displayNameLower, seo, contact, apiUrl);
  console.log('Done. Next steps:');
  console.log('  1. cd', targetDir);
  console.log('  2. npm install');
  console.log('  3. (Optional) Replace src/app/styles/variables.scss for new design');
  console.log('  4. npm run start  (or npm run build for production)');
}

main();
