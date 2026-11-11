const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /const newEl = \{[\s\S]*?paths: points\s*\};/;

const rep = `const newEl: MapElement = {
          id: Date.now().toString(),
          name: this.mode === 'draw-field' ? 'New Field' : 'New Block',
          type: this.mode === 'draw-field' ? 'field' : 'block',
          paths: points
        };`;

code = code.replace(regex, rep);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
