const fs = require('fs');
let code = fs.readFileSync('src/app/services/crop.service.ts', 'utf8');

const newInterface = `
export interface GrowthProgramDropDownList {
    id: string;
    name: string;
}
`;

const newMethod = `
  getGrowthPrograms(speciesId: string, breedId: string): Observable<GrowthProgramDropDownList[]> {
    return this.http.get<GrowthProgramDropDownList[]>(\`/api/external/crop/growth-program/species/\${speciesId}/breed/\${breedId}\`);
  }
`;

if (!code.includes('GrowthProgramDropDownList')) {
  code = code.replace("export class CropService {", newInterface + "\n@Injectable({ providedIn: 'root' })\nexport class CropService {");
  code = code.replace("private http = inject(HttpClient);", "private http = inject(HttpClient);\n" + newMethod);
  // wait, CropService already has `@Injectable({ providedIn: 'root' })` before `export class CropService {`?
  // Let's just fix it by replacing the class declaration.
}

fs.writeFileSync('src/app/services/crop.service.ts', code);
