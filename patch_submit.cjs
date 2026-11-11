const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');
const oldCode = `    const payload = this.updateStatusForm.value;
    
    this.isSubmittingUpdateStatus.set(true);`;
const newCode = `    const formValue = this.updateStatusForm.value;
    const payload: any = {
      status: formValue.status
    };
    if (formValue.remarks) payload.remarks = formValue.remarks;
    if (formValue.updatedBy) payload.updatedBy = formValue.updatedBy;
    if (formValue.resourcesUsed && formValue.resourcesUsed.length > 0) {
      payload.resourcesUsed = formValue.resourcesUsed.map((r: any) => ({
        ...r,
        quantityUsed: Number(r.quantityUsed)
      }));
    }
    
    this.isSubmittingUpdateStatus.set(true);`;
code = code.replace(oldCode, newCode);
fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
console.log('Patched submitUpdateStatus');
