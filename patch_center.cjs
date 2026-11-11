const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const importRegex = /import \{ FieldMapService, MapElement \} from '\.\.\/\.\.\/services\/field-map\.service';/;
code = code.replace(importRegex, "import { FieldMapService, MapElement } from '../../services/field-map.service';\nimport { FarmService } from '../../services/farm.service';\nimport { SessionService } from '../../services/session.service';");

const injectRegex = /private fieldMapService = inject\(FieldMapService\);/;
code = code.replace(injectRegex, `private fieldMapService = inject(FieldMapService);
  private farmService = inject(FarmService);
  private sessionService = inject(SessionService);`);

const initRegex = /ngAfterViewInit\(\) \{\s*this\.elements = JSON\.parse\(JSON\.stringify\(this\.fieldMapService\.elements\(\)\)\);/;
const repInit = `ngAfterViewInit() {
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
`;

code = code.replace(initRegex, repInit);
fs.writeFileSync(file, code);
