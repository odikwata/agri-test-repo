const fs = require('fs');

let code = fs.readFileSync('src/app/services/field-map.service.ts', 'utf8');

const regex = /export interface ManagementUnitListResponse \{[\s\S]*?\}/;
const newInterface = `export interface ManagementUnitListResponse {
    id: string;
    name: string;
    boundaryGeoJson: string;
    areaHectares: number;
    speciesNames: string[];
    createdOn: string;
    plantingCycle?: {
        id: string;
        crop: string;
    };
    landUnitType?: string;
    attributes?: Record<string, any>;
}`;

code = code.replace(regex, newInterface);

const mapRegex = /const mapEl: MapElement = \{[\s\S]*?rawUnit: unit\s*\};/;
const newMap = `const mapEl: MapElement = {
              id: unit.id,
              type: unit.landUnitType || 'CROP_FIELD',
              paths: paths,
              name: unit.name,
              size: unit.areaHectares,
              currentPlantings: currentPlantings,
              attributes: unit.attributes || {},
              rawUnit: unit
            };`;

code = code.replace(mapRegex, newMap);

fs.writeFileSync('src/app/services/field-map.service.ts', code);
