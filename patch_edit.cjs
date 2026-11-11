const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(/this\.drawingManager = new google\.maps\.drawing\.DrawingManager\(\{/g, 'this.drawingManager = new (google.maps.drawing.DrawingManager as any)({');
code = code.replace(/this\.drawingManager\.setMap/g, '(this.drawingManager as any).setMap');
code = code.replace(/this\.drawingManager\.setDrawingMode/g, '(this.drawingManager as any).setDrawingMode');
code = code.replace(/this\.drawingManager\.setOptions/g, '(this.drawingManager as any).setOptions');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
