const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace both setDrawingMode('polygon') and setOptions() to ensure correctness.
const regex = /\(this\.drawingManager as any\)\.setDrawingMode\('polygon'\);\s*\(this\.drawingManager as any\)\.setOptions\(\{[\s\S]*?\}\);/;

const rep = `const modeStr = (window as any).google.maps.drawing.OverlayType.POLYGON;
        (this.drawingManager as any).setOptions({
          drawingMode: modeStr,
          drawingControl: false,
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
        (this.drawingManager as any).setDrawingMode(modeStr);`;

code = code.replace(regex, rep);

fs.writeFileSync(file, code);
