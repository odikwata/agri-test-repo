const fs = require('fs');
let code = fs.readFileSync('src/app/app.config.ts', 'utf8');
code = code.replace("Settings, Sparkles, Sparkles,", "Settings, Sparkles,");
fs.writeFileSync('src/app/app.config.ts', code);
console.log('Fixed app.config.ts');
