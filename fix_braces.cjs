const fs = require('fs');
let code = fs.readFileSync('src/app/services/field-map.service.ts', 'utf8');
code = code.replace(/};\s*}/g, "}");
fs.writeFileSync('src/app/services/field-map.service.ts', code);
