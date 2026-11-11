const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /\(this\.cdr as any\)\.detectChanges\(\);\s*\}/;
const rep = `(this.cdr as any).detectChanges();
    }
    if (this.drawingManager) {
      console.log('Mode is now:', (this.drawingManager as any).getDrawingMode());
    }
`;

code = code.replace(regex, rep);
fs.writeFileSync(file, code);
