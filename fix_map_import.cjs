const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map/field-map.component.ts', 'utf8');
code = code.replace(/import \{ GoogleMapsModule \} from '@angular\/google-maps';/, "import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';");
fs.writeFileSync('src/app/pages/crops/field-map/field-map.component.ts', code);
