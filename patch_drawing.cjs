const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /initDrawingManager\(map: google\.maps\.Map\) \{[\s\S]*?\}(?=\s*setMode)/;

const rep = `initDrawingManager(map: google.maps.Map) {
    if (!window.google || !google.maps.drawing) {
      setTimeout(() => this.initDrawingManager(map), 500);
      return;
    }
    
    this.drawingManager = new (google.maps.drawing.DrawingManager as any)({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        fillColor: '#10b981',
        fillOpacity: 0.2,
        strokeColor: '#059669',
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
    
    (this.drawingManager as any).setMap(map);
    
    google.maps.event.addListener(this.drawingManager!, 'overlaycomplete', (e: any) => {
      if (e.type === google.maps.drawing.OverlayType.POLYGON || e.type === 'polygon') {
        const polygon = e.overlay;
        const path = polygon.getPath();
        const points = [];
        for (let i = 0; i < path.getLength(); i++) {
          const pt = path.getAt(i);
          points.push({ lat: pt.lat(), lng: pt.lng() });
        }
        
        const newEl = {
          id: Date.now().toString(),
          name: this.mode === 'draw-field' ? 'New Field' : 'New Block',
          type: this.mode === 'draw-field' ? 'field' : 'block',
          paths: points
        };
        
        this.elements = [...this.elements, newEl];
        this.fieldMapService.setElements(this.elements);
        
        polygon.setMap(null);
        
        this.setMode('select');
        this.selectedShapeId = newEl.id;
        (this.cdr as any).detectChanges();
      }
    });
  }

  `;

code = code.replace(regex, rep);

const setModeRegex = /setMode\(newMode: 'select' \| 'draw-field' \| 'draw-block'\) \{[\s\S]*?\}(?=\s*onPolygonClick)/;

const setModeRep = `setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
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
        (this.drawingManager as any).setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        this.selectedShapeId = null;
      }
    }
  }

  `;

code = code.replace(setModeRegex, setModeRep);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
