const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `app.get('/api/external/crop/planting-cycle/:id/activities', async (req, res) => {`;
const replacement = `app.post('/api/external/crop/planting-cycle/activities/create', async (req, res) => {
  try {
    const fetchRes = await fetch(\`https://upcountry-avert-urchin.ngrok-free.dev/api/v1/crop/planting-cycle/activities/create\`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
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

app.get('/api/external/crop/planting-cycle/:id/activities', async (req, res) => {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Added activities create route');
} else {
    console.log('Target not found');
}
