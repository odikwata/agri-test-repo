const ts = require('typescript');
const fs = require('fs');

const code = fs.readFileSync('src/app/pages/crops/accounting/crop-accounting.component.ts', 'utf8');
console.log(code.includes('import { FormsModule }'));
