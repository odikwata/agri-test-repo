const fs = require('fs');
let code = fs.readFileSync('src/app/services/crop.service.ts', 'utf8');
code = code.replace(/@Injectable\({ providedIn: 'root' }\)export interface GrowthProgramDropDownList/g, "export interface GrowthProgramDropDownList");
fs.writeFileSync('src/app/services/crop.service.ts', code);
