const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(/@ViewChild\('drawingManagerControl'\) drawingManagerControl!: ;/g, '');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
