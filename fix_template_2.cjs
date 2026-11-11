const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /<google-map height="100%" width="100%" \[center\]="center" \[zoom\]="15"   \(mapInitialized\)="onMapInitialized\(map: any\) \{[\s\S]*?\/\/ optional logic\s*\}/m;

const replacement = `<google-map height="100%" width="100%" [center]="center" [zoom]="15" (mapInitialized)="onMapInitialized($event)" [options]="{ mapTypeId: 'satellite', disableDoubleClickZoom: true }">
            <map-drawing-manager #drawingManagerControl="mapDrawingManager" [options]="drawingOptions" (polygonComplete)="onPolygonComplete($event)"></map-drawing-manager>
            @for (el of elements; track el.id) {
              <map-polygon 
                [paths]="el.paths" 
                [options]="getPolygonOptions(el)"
                (polygonClick)="onPolygonClick(el.id)"
                (polygonDragend)="onPolygonChange($event, el.id)"
                (polygonComplete)="onPolygonChange($event, el.id)">
              </map-polygon>
              <map-marker [position]="getCenterOfPolygon(el.paths)" [title]="el.name" [label]="el.name"></map-marker>
            }
          </google-map>
          </div>
        </div>
      </div>
    </div>
  \`
})
export class FieldMapEditComponent implements AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChildren(MapPolygon) polygons!: QueryList<MapPolygon>;
  @ViewChild('drawingManagerControl') drawingManagerControl!: MapDrawingManager;
  
  private fieldMapService = inject(FieldMapService);
  private farmService = inject(FarmService);
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  elements: MapElement[] = [];
  mode: 'select' | 'draw-field' | 'draw-block' = 'select';
  selectedShapeId: string | null = null;
  
  center: google.maps.LatLngLiteral = { lat: 41.876, lng: -87.641 };
  drawingOptions: any = { drawingMode: null };

  ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
    
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.farmService.getFarmById(farmId).subscribe({
        next: (farm) => {
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
    // optional logic
  }`;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
