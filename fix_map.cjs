const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map/field-map.component.ts', 'utf8');

// Add imports
code = code.replace(/import \{ Component, inject \} from '@angular\/core';/, "import { Component, inject, OnInit } from '@angular/core';\nimport { FarmService } from '../../../services/farm.service';\nimport { SessionService } from '../../../services/session.service';");

// Add implements OnInit
code = code.replace(/export class FieldMapComponent \{/, "export class FieldMapComponent implements OnInit {");

// Add injected services and ngOnInit
const classBodyRegex = /private fieldMapService = inject\(FieldMapService\);/;
const replacement = `private fieldMapService = inject(FieldMapService);
  private farmService = inject(FarmService);
  private sessionService = inject(SessionService);

  ngOnInit() {
    const farmId = this.sessionService.selectedFarmId();
    if (farmId) {
      this.farmService.getFarmById(farmId).subscribe({
        next: (farm: any) => {
          if (farm.latitude && farm.longitude) {
            this.center = { lat: Number(farm.latitude), lng: Number(farm.longitude) };
          }
        }
      });
    }
  }`;
  
code = code.replace(classBodyRegex, replacement);

fs.writeFileSync('src/app/pages/crops/field-map/field-map.component.ts', code);
