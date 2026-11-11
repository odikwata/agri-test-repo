const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /getAttributeOptions\(attr: any\): \{key: string, value: any\}\[\] \{\s*if \(\!attr\.valueSelection\) return \[\];\s*return Object\.keys\(attr\.valueSelection\)\.map\(k => \(\{ key: k, value: attr\.valueSelection\[k\] \}\)\);\s*\}/;

const replacement = `getAttributeOptions(attr: any): {key: string, value: any}[] {
    if (!attr.valueSelection) return [];
    if (Array.isArray(attr.valueSelection.options)) {
      return attr.valueSelection.options.map((opt: string) => ({ key: opt, value: opt }));
    }
    return Object.keys(attr.valueSelection).map(k => ({ key: k, value: attr.valueSelection[k] }));
  }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
