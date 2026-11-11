const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /clickable: true,/g;
// Replace only the ones in getPolygonOptions, wait, drawingOptions also has clickable: true, but that's for NEW polygons, which is fine.
// Actually, for getPolygonOptions:
code = code.replace(/clickable: true,\s*editable: isSelected/g, "clickable: this.mode === 'select',\n      editable: isSelected && this.mode === 'select'");

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
