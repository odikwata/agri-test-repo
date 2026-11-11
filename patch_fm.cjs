const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map/field-map.component.ts', 'utf8');

const target = `@if (elements().length === 0) {
            <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-white bg-opacity-90">
              <lucide-icon name="map" class="w-16 h-16 mb-4 opacity-20"></lucide-icon>
              <p class="text-lg font-medium">No fields or blocks mapped yet.</p>
              <p class="text-sm">Click "Edit Map" to start drawing.</p>
            </div>
          }
          <google-map height="100%" width="100%" [center]="center" [zoom]="15" mapId="DEMO_MAP_ID">
            @for (el of elements(); track el.id) {`;

const rep = `@if (elements().length === 0) {
            <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-white bg-opacity-90">
              <lucide-icon name="map" class="w-16 h-16 mb-4 opacity-20"></lucide-icon>
              <p class="text-lg font-medium">No fields or blocks mapped yet.</p>
              <p class="text-sm">Click "Edit Map" to start drawing.</p>
            </div>
          }
          <div class="absolute inset-0">
            <google-map height="100%" width="100%" [center]="center" [zoom]="15" mapId="DEMO_MAP_ID">
              @for (el of elements(); track el.id) {`;

code = code.replace(target, rep);
code = code.replace(`</google-map>
        </div>`, `</google-map>
          </div>
        </div>`);

fs.writeFileSync('src/app/pages/crops/field-map/field-map.component.ts', code);
