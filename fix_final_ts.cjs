const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace map-drawing-manager from template
code = code.replace(/<map-drawing-manager[\s\S]*?<\/map-drawing-manager>/, '');

// Import statements
code = code.replace(/MapDrawingManager[ ,]?/g, '');

// ViewChild for map-drawing-manager
code = code.replace(/@ViewChild\('drawingManagerControl'\) drawingManagerControl!: any;/, '');

// Class body properties
code = code.replace(/drawingOptions: any = \{ drawingMode: null \};/, `drawingManager: any = null;`);

// ngAfterViewInit
const initRegex = /ngAfterViewInit\(\) \{[\s\S]*?\}\s*onMapInitialized\(map: any\) \{[\s\S]*?\}/;
const replacementInit = `ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.farmService.getFarmById(farmId).subscribe({
        next: (farm: any) => {
          if (farm.latitude && farm.longitude) {
            this.center = { lat: Number(farm.latitude), lng: Number(farm.longitude) };
            if (this.map && this.map.googleMap) {
              this.map.googleMap.setCenter(this.center);
            }
          }
        }
      });
    }
  }

  onMapInitialized(map: any) {
    this.initDrawingManager();
  }

  initDrawingManager() {
    if (!window.google || !(google.maps as any).drawing) {
      setTimeout(() => this.initDrawingManager(), 500);
      return;
    }
    
    this.drawingManager = new (google.maps as any).drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
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
    
    if (this.map && this.map.googleMap) {
      this.drawingManager.setMap(this.map.googleMap);
    } else {
      setTimeout(() => this.initDrawingManager(), 500);
      return;
    }

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e: any) => {
      if (e.type === (google.maps as any).drawing.OverlayType.POLYGON || e.type === 'polygon') {
        const polygon = e.overlay;
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
        
        polygon.setMap(null);
        
        this.setMode('select');
        this.selectedShapeId = newEl.id;
        (this.cdr as any).detectChanges();
      }
    });
  }`;

code = code.replace(initRegex, replacementInit);

// Removing onPolygonComplete completely
code = code.replace(/onPolygonComplete\(polygon: any\) \{[\s\S]*?\}\s*setMode\(/, 'setMode(');
code = code.replace(/onPolygonComplete\(polygon: google\.maps\.Polygon\) \{[\s\S]*?\}\s*setMode\(/, 'setMode(');

// setMode 
const setModeRegex = /setMode\(newMode: 'select' \| 'draw-field' \| 'draw-block'\) \{[\s\S]*?\(this\.cdr as any\)\.detectChanges\(\);\s*\}/;
const replacementSetMode = `setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
    this.mode = newMode;
    if (this.drawingManager) {
      if (newMode === 'select') {
        if (this.map && this.map.googleMap) {
          this.map.googleMap.setOptions({ draggableCursor: null });
        }
        this.drawingManager.setDrawingMode(null);
      } else {
        const isField = newMode === 'draw-field';
        const modeStr = (window as any).google.maps.drawing.OverlayType.POLYGON;
        if (this.map && this.map.googleMap) {
          this.map.googleMap.setOptions({ draggableCursor: 'crosshair' });
        }
        this.drawingManager.setOptions({
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
        this.selectedShapeId = null;
      }
    }
    (this.cdr as any).detectChanges();
  }`;

code = code.replace(setModeRegex, replacementSetMode);

// add import to top: import { FarmService } from '../../services/farm.service'; import { SessionService } from '../../services/session.service';
if (!code.includes('FarmService')) {
  code = code.replace(/import \{ FieldMapService, MapElement \} from '\.\.\/\.\.\/services\/field-map\.service';/, "import { FieldMapService, MapElement } from '../../services/field-map.service';\nimport { FarmService } from '../../services/farm.service';\nimport { SessionService } from '../../services/session.service';");
}

fs.writeFileSync(file, code);
