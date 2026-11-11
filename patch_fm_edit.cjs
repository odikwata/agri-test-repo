const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const target = `<!-- Canvas Area -->
        <div class="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
          <google-map height="100%" width="100%" [center]="center" [zoom]="15" (mapClick)="onMapClick()" mapId="DEMO_MAP_ID">`;

const rep = `<!-- Canvas Area -->
        <div class="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
          <div class="absolute inset-0">
          <google-map height="100%" width="100%" [center]="center" [zoom]="15" (mapClick)="onMapClick()" mapId="DEMO_MAP_ID" (mapInitialized)="onMapInitialized($event)">`;

code = code.replace(target, rep);

code = code.replace(`</google-map>
        </div>
      </div>`, `</google-map>
          </div>
        </div>
      </div>`);

const initTarget = `  ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
    
    // Initialize drawing manager when map is ready
    if (this.map && this.map.googleMap) {
      this.initDrawingManager(this.map.googleMap);
    } else {
      // In case it's not ready immediately
      setTimeout(() => {
        if (this.map && this.map.googleMap) {
          this.initDrawingManager(this.map.googleMap);
        }
      }, 500);
    }
  }`;

const initRep = `  ngAfterViewInit() {
    this.elements = JSON.parse(JSON.stringify(this.fieldMapService.elements()));
  }

  onMapInitialized(map: google.maps.Map) {
    this.initDrawingManager(map);
  }`;

code = code.replace(initTarget, initRep);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
