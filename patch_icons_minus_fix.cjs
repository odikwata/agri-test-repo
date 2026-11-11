const fs = require('fs');
let code = fs.readFileSync('src/app/app.config.ts', 'utf8');

// The replacement was done twice or it already had Minus?
code = code.replace("Building2,\n  Minus,\n", "Building2,\n"); // remove the first one

fs.writeFileSync('src/app/app.config.ts', code);
console.log('Fixed minus duplicate');
