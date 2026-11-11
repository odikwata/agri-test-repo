const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `app.get('/api/external/crop/planting-cycle/:id', async (req, res) => {`;
const replacement = `app.get('/api/external/crop/planting-cycle/:id/activities', async (req, res) => {
  try {
    const page = req.query.page || 0;
    const size = req.query.size || 10;
    const fetchRes = await fetch(\`https://upcountry-avert-urchin.ngrok-free.dev/api/v1/crop/planting-cycle/\${req.params.id}/activities?page=\${page}&size=\${size}\`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });
    
    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({ error: \`External API returned \${fetchRes.status}\` });
    }
    
    const data = await fetchRes.json();
    return res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/external/crop/planting-cycle/:id', async (req, res) => {`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Added activities route');
} else {
    console.log('Target not found');
}
