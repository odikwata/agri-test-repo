const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /this\.selectedShapeId = null;\s*\}/g;
code = code.replace(regex, "this.selectedShapeId = null;\n      }\n      (this.cdr as any).detectChanges();");

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
