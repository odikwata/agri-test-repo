const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/drawingControl: false,/g, '');

fs.writeFileSync(file, code);
