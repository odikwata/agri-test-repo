const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

// We want to delete `onMapInitialized`, `initDrawingManager`, and `setMode` completely, and replace them.
const startIdx = code.indexOf('onMapInitialized(');
const endIdx = code.indexOf('onPolygonClick(');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `onMapInitialized(map: any) {
    // optional logic
  }
  
  onPolygonComplete(polygon: google.maps.Polygon) {
    const path = polygon.getPath();
    const points = [];
    for (let i = 0; i < path.getLength(); i++) {
      const pt = path.getAt(i);
      points.push({ lat: pt.lat(), lng: pt.lng() });
    }
    
    let areaHectares = 0;
    if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
      const sqMeters = google.maps.geometry.spherical.computeArea(path);
      areaHectares = Number((sqMeters / 10000).toFixed(2));
    }
    
    const newEl: MapElement = {
      id: Date.now().toString(),
      name: this.mode === 'draw-field' ? 'New Field' : 'New Block',
      type: this.mode === 'draw-field' ? 'field' : 'block',
      paths: points,
      size: areaHectares
    };
    
    this.elements = [...this.elements, newEl];
    this.fieldMapService.setElements(this.elements);
    
    // remove the drawn polygon since we render it via map-polygon
    polygon.setMap(null);
    
    this.setMode('select');
    this.selectedShapeId = newEl.id;
    (this.cdr as any).detectChanges();
  }

  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    this.mode = newMode;
    if (newMode === 'select') {
      if (this.map && this.map.googleMap) {
        this.map.googleMap.setOptions({ draggableCursor: null });
      }
      this.drawingOptions = { ...this.drawingOptions, drawingMode: null };
    } else {
      const isField = newMode === 'draw-field';
      const modeStr = (window as any).google.maps.drawing.OverlayType.POLYGON;
      if (this.map && this.map.googleMap) {
        this.map.googleMap.setOptions({ draggableCursor: 'crosshair' });
      }
      this.drawingOptions = {
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
      };
      this.selectedShapeId = null;
    }
    (this.cdr as any).detectChanges();
  }
  
  `;
  
  code = code.slice(0, startIdx) + replacement + code.slice(endIdx);
  fs.writeFileSync(file, code);
}
