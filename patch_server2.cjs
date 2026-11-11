const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("const path = req.params[0];", "const path = req.params['0'];");

fs.writeFileSync('server.ts', code);
console.log('Patched server.ts');
