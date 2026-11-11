const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /onPolygonClick\(id: string\) \{[\s\S]*?\(this\.cdr as any\)\.detectChanges\(\);\s*\}/;

const setupFn = `
  pathListeners: any[] = [];

  setupEditableListeners(id: string) {
    // Clear old listeners
    this.pathListeners.forEach(l => google.maps.event.removeListener(l));
    this.pathListeners = [];

    setTimeout(() => {
      if (!this.polygons) return;
      const polysArray = this.polygons.toArray();
      const index = this.elements.findIndex(el => el.id === id);
      if (index === -1) return;
      
      const polyComponent = polysArray[index];
      if (polyComponent && polyComponent.polygon) {
        const path = polyComponent.polygon.getPath();
        if (path) {
          const updateFn = () => this.updatePolygonSize(id, polyComponent.polygon);
          this.pathListeners.push(google.maps.event.addListener(path, 'set_at', updateFn));
          this.pathListeners.push(google.maps.event.addListener(path, 'insert_at', updateFn));
          this.pathListeners.push(google.maps.event.addListener(path, 'remove_at', updateFn));
        }
      }
    }, 100);
  }

  updatePolygonSize(id: string, polygon: any) {
    if (!polygon) return;
    const path = polygon.getPath();
    if (!path) return;
    
    let areaHectares = 0;
    if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
      const sqMeters = google.maps.geometry.spherical.computeArea(path);
      areaHectares = Number((sqMeters / 10000).toFixed(2));
    }
    
    const index = this.elements.findIndex(el => el.id === id);
    if (index !== -1) {
      this.elements[index].size = areaHectares;
      const points = [];
      for (let i = 0; i < path.getLength(); i++) {
        const pt = path.getAt(i);
        points.push({ lat: pt.lat(), lng: pt.lng() });
      }
      this.elements[index].paths = points;
      if (this.cdr) (this.cdr as any).detectChanges();
    }
  }

  onPolygonClick(id: string) {
    if (this.mode === 'select') {
      this.selectedShapeId = id;
      if (this.selectedElement && this.selectedElement.type) {
        this.loadAttributesForType(this.selectedElement.type);
      }
      (this.cdr as any).detectChanges();
      this.setupEditableListeners(id);
    }
  }`;

code = code.replace(regex, setupFn);

const onMapInitialized = `onMapInitialized(map: google.maps.Map) {
    this.map = { googleMap: map } as any;
    // ensure setup drawing manager etc
    // but the code originally has its own logic
`;

// Let's also patch onPolygonChange if it was used for dragging
code = code.replace(/onPolygonChange\(event: any, id: string\) \{[\s\S]*?\}/, `onPolygonChange(event: any, id: string) {
    setTimeout(() => {
      if (!this.polygons) return;
      const polysArray = this.polygons.toArray();
      const index = this.elements.findIndex(el => el.id === id);
      if (index === -1) return;
      const polyComponent = polysArray[index];
      if (polyComponent && polyComponent.polygon) {
        this.updatePolygonSize(id, polyComponent.polygon);
      }
    }, 100);
  }`);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
