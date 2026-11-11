const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const route = `
app.post('/api/external/farm/management-units', async (req, res) => {
  try {
    const fetchRes = await fetch('https://upcountry-avert-urchin.ngrok-free.dev/api/v1/farm/management-units', {
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
    return res.status(500).json({ error: 'Failed to fetch from external API' });
  }
});
`;

code = code.replace("// Proxy external Farm API to bypass CORS", "// Proxy external Farm API to bypass CORS\n" + route);
fs.writeFileSync('server.ts', code);
