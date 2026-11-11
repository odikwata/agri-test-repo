const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const replaceStr = `  ngOnInit() {
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

      if (this.elements.length === 0) {
        this.fieldMapService.loadFieldsForFarm(farmId).subscribe({
          next: (elements) => {
            this.elements = JSON.parse(JSON.stringify(elements));
            this.fieldMapService.setElements(elements);
          },
          error: (err) => {
            console.error('Failed to load fields', err);
          }
        });
      }
    }
  }`;

code = code.replace(/ngOnInit\(\) \{[\s\S]*?\}\s*ngAfterViewInit\(\) \{/, replaceStr + '\n\n  ngAfterViewInit() {');

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
