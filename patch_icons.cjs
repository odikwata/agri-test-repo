const fs = require('fs');
let code = fs.readFileSync('src/app/app.config.ts', 'utf8');
code = code.replace("Settings,", "Settings, Sparkles,");
code = code.replace("Settings,", "Settings, Sparkles,");
fs.writeFileSync('src/app/app.config.ts', code);
console.log('Patched app.config.ts');
