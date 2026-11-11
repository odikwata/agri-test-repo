const fs = require('fs');
let code = fs.readFileSync('src/app/app.config.ts', 'utf8');

if (!code.includes("Minus\n} from 'lucide-angular';") && !code.includes("Minus,")) {
    code = code.replace("Building2,\n", "Building2,\n  Minus,\n");
    code = code.replace("Building2,\n", "Building2,\n        Minus,\n");
    fs.writeFileSync('src/app/app.config.ts', code);
    console.log('Patched icons minus');
}
