import fs from 'fs';
import path from 'path';

const routersDir = path.join(process.cwd(), 'yogoblast2', 'backend', 'Routers');
console.log('Scanning', routersDir);
if (!fs.existsSync(routersDir)) {
  console.error('Routers directory not found:', routersDir);
  process.exit(1);
}
const files = fs.readdirSync(routersDir).filter(f => f.endsWith('.js'));
for (const f of files) {
  const fp = path.join(routersDir, f);
  const src = fs.readFileSync(fp, 'utf8');
  console.log('\nFile:', fp);
  const re = /router\.(get|post|put|delete|use)\s*\(\s*(['"`])([^'"`]+)\2/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const method = m[1];
    const route = m[3];
    console.log('  ', method, route);
    if (route.includes(':') || route.includes('\\')) {
      console.warn('    -> suspicious route (contains : or \\):', route);
    }
  }
}
