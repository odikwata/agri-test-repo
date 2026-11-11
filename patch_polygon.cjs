const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');
code = code.replace(/\(this\.drawingManager as any\)\.setDrawingMode\(google\.maps\.drawing\.OverlayType\.POLYGON\);/g, "(this.drawingManager as any).setDrawingMode('polygon');");

// Also let's fix double click zoom just in case
code = code.replace(/\[options\]="\{ mapTypeId: \\'satellite\\' \}"/g, '[options]="{ mapTypeId: \\\'satellite\\\', disableDoubleClickZoom: true }"');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
