const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `// Handle unknown API routes with 404
app.use('/api', (req, res) => {`;

const replacement = `app.get('/api/gmp-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_PLATFORM_KEY || '' });
});

// Handle unknown API routes with 404
app.use('/api', (req, res) => {`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
