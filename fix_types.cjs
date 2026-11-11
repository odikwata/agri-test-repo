const fs = require('fs');

let code = fs.readFileSync('src/app/services/field-map.service.ts', 'utf8');

code = code.replace(/type: 'field' \| 'block';/, "type: string;");
code = code.replace(/soilType\?\: string;/, "");
code = code.replace(/irrigationSystem\?\: 'drip' \| 'sprinkler' \| 'none';/, "");
code = code.replace(/dripLines\?\: number;/, "");
code = code.replace(/sprinklersCount\?\: number;/, "attributes?: Record<string, any>;");
code = code.replace(/type: 'field',/g, "type: 'CROP_FIELD',");

const attrInterface = `
export interface LandAttribute {
    id?: string;
    name: string;
    landUnitType: string;
    valueSelection?: Record<string, any>;
}
`;

code = code.replace(/export interface MapElement/, attrInterface + '\nexport interface MapElement');

const attrMethod = `
  getLandAttributes(landUnitType: string): Observable<LandAttribute[]> {
    return this.http.get<LandAttribute[]>(\`/api/v1/farm/land-attributes/\${landUnitType}\`);
  }
`;

code = code.replace(/loadFieldsForFarm/, attrMethod + '\n  loadFieldsForFarm');

fs.writeFileSync('src/app/services/field-map.service.ts', code);
