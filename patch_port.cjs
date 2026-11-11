const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("const port = 3000;", "const port = process.env.PORT || 3000;");
fs.writeFileSync('server.ts', code);
console.log('Patched port');
