const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/return return /g, 'return ');

fs.writeFileSync('server.ts', code);
