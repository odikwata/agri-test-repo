const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const target = `  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    console.log('setMode called', newMode, 'drawingManager:', !!this.drawingManager);
    this.mode = newMode;
    
    if (this.drawingManager) {
      if (newMode === 'select') {
        (this.drawingManager as any).setDrawingMode(null);
      } else {
        const isField = newMode === 'draw-field';
        (this.drawingManager as any).setOptions({
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
        try {
          (this.drawingManager as any).setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
          console.log('setDrawingMode success');
        } catch(e) {
          console.error('setDrawingMode error', e);
        }
        this.selectedShapeId = null;
      }
    }
  }`;

const rep = `  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    this.mode = newMode;
    if (this.drawingManager) {
      if (newMode === 'select') {
        (this.drawingManager as any).setDrawingMode(null);
      } else {
        const isField = newMode === 'draw-field';
        (this.drawingManager as any).setOptions({
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
        (this.drawingManager as any).setDrawingMode('polygon');
        this.selectedShapeId = null;
      }
    }
  }`;

code = code.replace(target, rep);
fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
