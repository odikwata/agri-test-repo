const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

// Replace the entire getAttributeValue method and any trailing junk
const startIdx = code.indexOf('getAttributeValue(attr: any): any {');
const endIdx = code.indexOf('ngOnInit() {');
if (startIdx !== -1 && endIdx !== -1) {
  const newMethod = `getAttributeValue(attr: any): any {
    if (this.selectedElement?.attributes) {
      const existing = this.selectedElement.attributes.find(a => a.name === attr.name);
      return existing ? existing.value : attr.id;
    }
    return attr.id;
  }
  
`;
  code = code.substring(0, startIdx) + newMethod + code.substring(endIdx);
}

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
