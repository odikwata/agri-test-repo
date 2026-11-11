const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

const regex = /ngOnDestroy\(\) \{/;
const rep = `get selectedElement() {
    return this.elements.find(el => el.id === this.selectedShapeId);
  }

  clearMap() {
    if (confirm('Are you sure you want to clear all mapped areas?')) {
      this.elements = [];
      this.selectedShapeId = null;
    }
  }

  deleteSelected() {
    if (this.selectedShapeId && confirm('Delete this area?')) {
      this.elements = this.elements.filter(el => el.id !== this.selectedShapeId);
      this.selectedShapeId = null;
    }
  }

  ngOnDestroy() {`;

code = code.replace(regex, rep);
fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
