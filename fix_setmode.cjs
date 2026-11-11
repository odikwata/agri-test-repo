const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /setMode\(newMode: 'select' \| 'draw-field' \| 'draw-block'\) \{[\s\S]*?\}(?=\s*onPolygonClick)/;
const rep = `setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    this.mode = newMode;
    console.log('Setting mode to:', newMode, 'Drawing manager exists?', !!this.drawingManager);
    
    if (this.drawingManager) {
      if (newMode === 'select') {
        (this.drawingManager as any).setDrawingMode(null);
      } else {
        const isField = newMode === 'draw-field';
        (this.drawingManager as any).setOptions({
          drawingMode: (window as any).google.maps.drawing.OverlayType.POLYGON,
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
        this.selectedShapeId = null;
      }
      (this.cdr as any).detectChanges();
    }
  }

  `;

code = code.replace(regex, rep);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
