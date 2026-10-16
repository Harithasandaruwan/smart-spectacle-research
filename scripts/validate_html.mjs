import fs from 'fs';
import path from 'path';

const htmlFiles = [
  'index.html',
  'domain.html',
  'milestones.html',
  'documents.html',
  'presentations.html',
  'about.html',
  'contact.html'
];

let hasErrors = false;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log(`Checking ${file}...`);

  // Check href and src
  const linkMatches = content.matchAll(/(?:href|src)=["']([^"']+)["']/g);
  for (const match of linkMatches) {
    const rawUrl = match[1];
    
    // Ignore external URLs, mailto, tel, javascript
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('mailto:') || rawUrl.startsWith('tel:') || rawUrl.startsWith('javascript:')) {
      continue;
    }

    const [pathname, hash] = rawUrl.split('#');

    // If pathname is empty, it's an anchor within the same file
    if (!pathname && hash) {
      if (!content.includes(`id="${hash}"`) && !content.includes(`name="${hash}"`)) {
        console.warn(`  [WARN] Anchor #${hash} not found in ${file}`);
      }
      continue;
    }

    if (pathname) {
      const decodedPath = decodeURIComponent(pathname);
      const targetFilePath = path.resolve(decodedPath);
      if (!fs.existsSync(targetFilePath)) {
        console.error(`  [ERROR] Broken link in ${file}: ${pathname} -> ${targetFilePath} does not exist`);
        hasErrors = true;
      } else if (hash && pathname.endsWith('.html')) {
        const targetContent = fs.readFileSync(targetFilePath, 'utf-8');
        if (!targetContent.includes(`id="${hash}"`) && !targetContent.includes(`name="${hash}"`)) {
          console.warn(`  [WARN] Anchor #${hash} not found in target file ${pathname}`);
        }
      }
    }
  }
}

if (!hasErrors) {
  console.log('\nAll HTML files validated successfully! No broken local file links found.');
} else {
  console.error('\nSome broken links were detected.');
  process.exit(1);
}
