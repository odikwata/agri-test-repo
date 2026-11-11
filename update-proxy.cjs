const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
app.get('/api/external/crop/growth-program/species/:speciesId/breed/:breedId', async (req, res) => {
  try {
    const { speciesId, breedId } = req.params;
    const fetchRes = await fetch(\`https://upcountry-avert-urchin.ngrok-free.dev/api/v1/growth-program/species/\${speciesId}/breed/\${breedId}\`, {
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
  } catch (err) {
    console.error('Error fetching growth programs:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
`;

if (!code.includes('/api/external/crop/growth-program/species/:speciesId/breed/:breedId')) {
  code = code.replace("app.get('/api/external/species/all'", newRoute + "\napp.get('/api/external/species/all'");
  fs.writeFileSync('server.ts', code);
}
