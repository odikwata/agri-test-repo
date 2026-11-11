const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /export class FieldMapEditComponent implements AfterViewInit, OnDestroy \{[\s\S]*$/;

const newClass = `export class FieldMapEditComponent implements AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  private fieldMapService = inject(FieldMapService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  elements: MapElement[] = [];
  mode: 'select' | 'draw-field' | 'draw-block' = 'select';
  selectedShapeId: string | null = null;
  
  center: google.maps.LatLngLiteral = { lat: 41.876, lng: -87.641 };
  drawingManager: google.maps.drawing.DrawingManager | null = null;

  ngAfterViewInit() {
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
  }

  initDrawingManager(map: google.maps.Map) {
    if (!window.google || !google.maps.drawing) {
      setTimeout(() => this.initDrawingManager(map), 500);
      return;
    }
    
    this.drawingManager = new (google.maps.drawing.DrawingManager as any)({
      map: map,
      drawingMode: null,
      drawingControl: true,
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
    
    google.maps.event.addListener(this.drawingManager!, 'overlaycomplete', (e: any) => {
      if (e.type === google.maps.drawing.OverlayType.POLYGON || e.type === 'polygon') {
        const polygon = e.overlay;
        const path = polygon.getPath();
        const points = [];
        for (let i = 0; i < path.getLength(); i++) {
          const pt = path.getAt(i);
          points.push({ lat: pt.lat(), lng: pt.lng() });
        }
        
        const newEl: MapElement = {
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

  setMode(newMode: 'select' | 'draw-field' | 'draw-block') {
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
        } catch(e) {
          (this.drawingManager as any).setDrawingMode('polygon');
        }
        this.selectedShapeId = null;
      }
    }
  }

  onPolygonClick(id: string) {
    if (this.mode === 'select') {
      this.selectedShapeId = id;
      (this.cdr as any).detectChanges();
    }
  }

  onPolygonChange(event: any, id: string) {
    // optional updates if needed
  }

  getPolygonOptions(el: MapElement): google.maps.PolygonOptions {
    const isField = el.type === 'field';
    const isSelected = this.selectedShapeId === el.id;
    return {
      fillColor: isField ? '#10b981' : '#f59e0b',
      fillOpacity: isSelected ? 0.4 : 0.2,
      strokeColor: isField ? '#059669' : '#d97706',
      strokeWeight: isSelected ? 3 : 2,
      clickable: true,
      editable: isSelected,
      zIndex: isSelected ? 10 : 1
    };
  }

  getCenterOfPolygon(paths: { lat: number; lng: number }[]): google.maps.LatLngLiteral {
    if (!paths || paths.length === 0) return this.center;
    const lat = paths.reduce((sum, p) => sum + p.lat, 0) / paths.length;
    const lng = paths.reduce((sum, p) => sum + p.lng, 0) / paths.length;
    return { lat, lng };
  }

  saveMap() {
    this.fieldMapService.setElements(this.elements);
    this.router.navigate(['/crops/map']);
  }

  ngOnDestroy() {
    if (this.drawingManager) {
      (this.drawingManager as any).setMap(null);
    }
  }
}
`;

code = code.replace(regex, newClass);
fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
