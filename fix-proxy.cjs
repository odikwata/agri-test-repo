const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  "https://upcountry-avert-urchin.ngrok-free.dev/api/v1/growth-program/species/${speciesId}/breed/${breedId}",
  "https://upcountry-avert-urchin.ngrok-free.dev/api/v1/growth-program//species/${speciesId}/breed/${breedId}"
);
fs.writeFileSync('server.ts', code);
