const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

// Replace select binding
code = code.replace(/<select \[ngModel\]="selectedElement\.attributes\?\.\[attr\.name\]" \(ngModelChange\)="setAttribute\(attr\.name, \$event\)"/g, 
  '<select [ngModel]="getAttributeValue(attr.name)" (ngModelChange)="setAttribute(attr, $event)"');

// Replace input binding
code = code.replace(/<input type="text" \[ngModel\]="selectedElement\.attributes\?\.\[attr\.name\]" \(ngModelChange\)="setAttribute\(attr\.name, \$event\)"/g,
  '<input type="text" [ngModel]="getAttributeValue(attr.name)" (ngModelChange)="setAttribute(attr, $event)"');

// Fix onTypeChange attributes init
code = code.replace(/this\.selectedElement\.attributes = \{\};/g, 'this.selectedElement.attributes = [];');

// Replace setAttribute method
const setAttrRegex = /setAttribute\(name: string, value: any\) \{[\s\S]*?\}/;
const newSetAttr = `setAttribute(attr: any, value: any) {
    if (this.selectedElement) {
      if (!this.selectedElement.attributes) {
        this.selectedElement.attributes = [];
      }
      const existing = this.selectedElement.attributes.find(a => a.name === attr.name);
      if (existing) {
        existing.value = value;
      } else {
        this.selectedElement.attributes.push({ id: attr.id || '', name: attr.name, value: value });
      }
    }
  }

  getAttributeValue(name: string): any {
    if (this.selectedElement?.attributes) {
      const attr = this.selectedElement.attributes.find(a => a.name === name);
      return attr ? attr.value : undefined;
    }
    return undefined;
  }`;

code = code.replace(setAttrRegex, newSetAttr);

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
