const fs = require('fs');
const file = 'src/app/pages/crops/field-map-edit/field-map-edit.component.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /const points = \[\];\s*for \(let i = 0; i < path\.getLength\(\); i\+\+\) \{\s*const pt = path\.getAt\(i\);\s*points\.push\(\{ lat: pt\.lat\(\), lng: pt\.lng\(\) \}\);\s*\}\s*const newEl: MapElement = \{\s*id: Date\.now\(\)\.toString\(\),\s*name: this\.mode === 'draw-field' \? 'New Field' : 'New Block',\s*type: this\.mode === 'draw-field' \? 'field' : 'block',\s*paths: points\s*\};/;

const rep = `const points = [];
        for (let i = 0; i < path.getLength(); i++) {
          const pt = path.getAt(i);
          points.push({ lat: pt.lat(), lng: pt.lng() });
        }
        
        let areaHectares = 0;
        if (window.google && google.maps.geometry && google.maps.geometry.spherical) {
          const sqMeters = google.maps.geometry.spherical.computeArea(path);
          areaHectares = Number((sqMeters / 10000).toFixed(2));
        }
        
        const newEl: MapElement = {
          id: Date.now().toString(),
          name: this.mode === 'draw-field' ? 'New Field' : 'New Block',
          type: this.mode === 'draw-field' ? 'field' : 'block',
          paths: points,
          size: areaHectares
        };`;

code = code.replace(regex, rep);

fs.writeFileSync(file, code);
