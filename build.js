#!/usr/bin/env node
// Inlines public/app.js and public/client.js into worker.ts.
// Run: node build.js
// Then: wrangler deploy

const fs = require('fs');

const workerSrc = fs.readFileSync('worker.ts', 'utf8');
const appJs = fs.readFileSync('public/app.js', 'utf8');
const clientJs = fs.readFileSync('public/client.js', 'utf8');

// Verify no backticks (would break template literal embedding)
for (const [name, content] of [['app.js', appJs], ['client.js', clientJs]]) {
  if (content.includes('`')) {
    console.error(`Error: ${name} contains backticks — escape them first.`);
    process.exit(1);
  }
}

// Replace the const APP_JS and CLIENT_JS blocks
const result = workerSrc
  .replace(/const APP_JS = `[\s\S]*?`;/, 'const APP_JS = `' + appJs + '`;')
  .replace(/const CLIENT_JS = `[\s\S]*?`;/, 'const CLIENT_JS = `' + clientJs + '`;');

fs.writeFileSync('worker.ts', result);
console.log('worker.ts updated (' + result.length + ' bytes)');
