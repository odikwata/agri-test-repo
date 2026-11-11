const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetOpenModal = `  openUpdateStatusModal() {
    const currentDetail = this.selectedActivityDetail();
    if (currentDetail) {
      this.updateStatusForm.reset({
        status: currentDetail.currentStage?.status || 'PENDING',`;

const newOpenModal = `  openUpdateStatusModal() {
    const currentDetail = this.selectedActivityDetail();
    if (currentDetail) {
      this.updateStatusForm.reset({
        status: currentDetail.currentStage?.status || 'SCHEDULED',`;

if(code.includes(targetOpenModal)) {
    code = code.replace(targetOpenModal, newOpenModal);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched openUpdateStatusModal');
} else {
    console.log('Target openUpdateStatusModal not found');
}
