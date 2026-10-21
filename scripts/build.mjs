import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const supabaseUrl = process.env.SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in the Netlify build environment.');
}

const parsedUrl = new URL(supabaseUrl);
if (parsedUrl.protocol !== 'https:') {
  throw new Error('SUPABASE_URL must use HTTPS.');
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

for (const file of ['index.html', 'app.js', 'style.css']) {
  cpSync(file, `dist/${file}`);
}

const config = JSON.stringify({ url: supabaseUrl, publishableKey });
writeFileSync('dist/supabase-config.js', `window.CLOUDWISE_SUPABASE = ${config};\n`);
