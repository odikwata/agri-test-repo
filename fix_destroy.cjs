const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/ngOnDestroy\(\) \{\s*if \(this\.drawingManager\) \{\s*\(this\.drawingManager as any\)\.setMap\(null\);\s*\}\s*\}/, `ngOnDestroy() {}`);

fs.writeFileSync(file, code);
