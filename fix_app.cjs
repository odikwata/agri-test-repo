const fs = require('fs');

// Fix app.config.ts for google maps version
let configCode = fs.readFileSync('src/app/app.config.ts', 'utf8');
configCode = configCode.replace(/libraries=drawing,geometry,places/, "libraries=drawing,geometry,places&v=3.64");
fs.writeFileSync('src/app/app.config.ts', configCode);

// Fix field-map-edit.component.ts
let editCode = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');
editCode = editCode.replace(/mouse-pointer-2/g, "mouse-pointer");
editCode = editCode.replace(/name="grid"/g, 'name="layout-grid"');

// Fix ExpressionChangedAfterItHasBeenCheckedError by moving elements initialization to ngOnInit
editCode = editCode.replace(/export class FieldMapEditComponent implements AfterViewInit, OnDestroy \{/, "export class FieldMapEditComponent implements OnInit, AfterViewInit, OnDestroy {");
editCode = editCode.replace(/import \{ Component, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy, inject, ChangeDetectorRef \} from '@angular\/core';/, "import { Component, ViewChild, ViewChildren, QueryList, OnInit, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';");

const afterViewInitBody = `
  ngOnInit() {
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

  ngAfterViewInit() {
  }
`;

editCode = editCode.replace(/ngAfterViewInit\(\) \{\s*this\.elements = JSON\.parse\(JSON\.stringify\(this\.fieldMapService\.elements\(\)\)\);[\s\S]*?\}\s*\}\s*\}\s*\)\;\s*\}\s*\}/, afterViewInitBody);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', editCode);
