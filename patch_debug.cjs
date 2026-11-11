const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace(`  initDrawingManager(map: google.maps.Map) {
    if (!window.google || !google.maps.drawing) return;`, `  initDrawingManager(map: google.maps.Map) {
    console.log('initDrawingManager called', { hasGoogle: !!window.google, hasDrawing: !!(window.google && google.maps && google.maps.drawing) });
    if (!window.google || !google.maps.drawing) {
      console.warn('Google Maps drawing library not available yet');
      setTimeout(() => this.initDrawingManager(map), 500);
      return;
    }`);

code = code.replace(`  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    this.mode = newMode;
    
    if (this.drawingManager) {`, `  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    console.log('setMode called', newMode, 'drawingManager:', !!this.drawingManager);
    this.mode = newMode;
    
    if (this.drawingManager) {`);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
