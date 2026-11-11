const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /\(this\.drawingManager as any\)\.setOptions\(\{[\s\S]*?\}\);/g;
const rep = `(this.drawingManager as any).setOptions({
          polygonOptions: {
            fillColor: isField ? '#10b981' : '#f59e0b',
            fillOpacity: 0.2,
            strokeColor: isField ? '#059669' : '#d97706',
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 1
          }
        });
        (this.drawingManager as any).setDrawingMode('polygon');`;

code = code.replace(regex, rep);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
