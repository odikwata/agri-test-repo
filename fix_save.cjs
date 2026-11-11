const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const classBodyRegex = /import \{ FieldMapService, MapElement \} from '\.\.\/\.\.\/\.\.\/services\/field-map\.service';/;
code = code.replace(classBodyRegex, "import { FieldMapService, MapElement, CreateManagementUnitRequest } from '../../../services/field-map.service';\nimport { forkJoin, of } from 'rxjs';\nimport { switchMap } from 'rxjs/operators';");

const saveMapRegex = /saveMap\(\) \{[\s\S]*?this\.router\.navigate\(\['\/crops\/map'\]\);\s*\}/;

const newSaveMap = `saveMap() {
    if (this.polygons) {
      const polysArray = this.polygons.toArray();
      this.elements.forEach((el, index) => {
        const polyComponent = polysArray[index];
        if (polyComponent && polyComponent.polygon) {
          const path = polyComponent.polygon.getPath();
          if (path) {
            const points = [];
            for (let i = 0; i < path.getLength(); i++) {
              const pt = path.getAt(i);
              points.push({ lat: pt.lat(), lng: pt.lng() });
            }
            el.paths = points;
            
            if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
              const sqMeters = google.maps.geometry.spherical.computeArea(path);
              el.size = Number((sqMeters / 10000).toFixed(2));
            }
          }
        }
      });
    }

    const farmId = this.sessionService.selectedFarmId();
    if (!farmId) {
      this.fieldMapService.setElements(this.elements);
      this.router.navigate(['/crops/map']);
      return;
    }

    const newElements = this.elements.filter(el => !el.rawUnit);
    
    if (newElements.length === 0) {
      this.fieldMapService.setElements(this.elements);
      this.router.navigate(['/crops/map']);
      return;
    }

    const createObservables = newElements.map(el => {
      // Build GeoJSON Polygon
      const coordinates = el.paths.map(p => [p.lng, p.lat]);
      // Close the polygon
      if (coordinates.length > 0) {
        coordinates.push(coordinates[0]);
      }
      
      const geoJson = {
        type: "Polygon",
        coordinates: [coordinates]
      };

      const request: CreateManagementUnitRequest = {
        name: el.name,
        farmId: farmId,
        landUnitType: el.type,
        boundaryGeoJson: JSON.stringify(geoJson),
        areaHectares: el.size,
        attributes: el.attributes
      };

      return this.fieldMapService.createManagementUnit(request);
    });

    forkJoin(createObservables).subscribe({
      next: (responses) => {
        // We might want to reload the fields from backend after saving
        // Or just navigate and let the map component reload them
        this.fieldMapService.setElements(this.elements);
        this.router.navigate(['/crops/map']);
      },
      error: (err) => {
        console.error('Failed to create management units', err);
        // Even if it fails, maybe navigate or show error
        this.fieldMapService.setElements(this.elements);
        this.router.navigate(['/crops/map']);
      }
    });
  }`;

code = code.replace(saveMapRegex, newSaveMap);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
