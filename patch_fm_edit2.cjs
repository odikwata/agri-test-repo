const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const target1 = `  ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
  }

  onMapInitialized(map: google.maps.Map) {
    this.initDrawingManager(map);
  }`;

const rep1 = `  ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
    
    const checkMap = () => {
      if (this.map && this.map.googleMap) {
        this.initDrawingManager(this.map.googleMap);
      } else {
        setTimeout(checkMap, 200);
      }
    };
    checkMap();
  }

  onMapInitialized(map: any) {
    // handled in ngAfterViewInit
  }`;

code = code.replace(target1, rep1);

const target2 = `  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
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
        (this.drawingManager as any).setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        this.selectedShapeId = null;
      }
    }
  }`;

const rep2 = `  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
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
        (this.drawingManager as any).setDrawingMode('polygon');
        this.selectedShapeId = null;
      }
    }
  }`;

code = code.replace(target2, rep2);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
