const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/new-planting/new-planting.component.ts', 'utf8');
code = code.replace(
  "this.seedType = '';\n    if (this.selectedCropId)",
  "this.seedType = '';\n    this.onVarietyChange();\n    if (this.selectedCropId)"
);
fs.writeFileSync('src/app/pages/crops/new-planting/new-planting.component.ts', code);
