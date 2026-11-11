const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetLogic = `  showLogActivityModal = signal(false);`;

const newLogic = `  showUpdateStatusModal = signal(false);
  isSubmittingUpdateStatus = signal(false);

  updateStatusForm: FormGroup = this.fb.nonNullable.group({
    status: ['', Validators.required],
    remarks: [''],
    updatedBy: [''],
    resourcesUsed: this.fb.array([])
  });

  get resourcesUsedControls() {
    return this.updateStatusForm.get('resourcesUsed') as FormArray;
  }

  addResourceUsage() {
    this.resourcesUsedControls.push(this.fb.group({
      resourceType: ['INVENTORY_ITEM', Validators.required],
      resourceName: [''],
      quantityUsed: [0, [Validators.required, Validators.min(0.01)]],
      unitOfMeasure: ['KILOGRAM', Validators.required]
    }));
  }

  removeResourceUsage(index: number) {
    this.resourcesUsedControls.removeAt(index);
  }

  openUpdateStatusModal() {
    const currentDetail = this.selectedActivityDetail();
    if (currentDetail) {
      this.updateStatusForm.reset({
        status: currentDetail.currentStage?.status || 'PENDING',
        remarks: '',
        updatedBy: ''
      });
      this.resourcesUsedControls.clear();
      this.showUpdateStatusModal.set(true);
    }
  }

  closeUpdateStatusModal() {
    this.showUpdateStatusModal.set(false);
  }

  submitUpdateStatus() {
    if (this.updateStatusForm.invalid) {
      this.updateStatusForm.markAllAsTouched();
      return;
    }

    const currentDetail = this.selectedActivityDetail();
    if (!currentDetail) return;

    const payload = this.updateStatusForm.value;
    
    this.isSubmittingUpdateStatus.set(true);
    this.cropService.updateActivityStatus(currentDetail.id, payload).subscribe({
      next: () => {
        this.isSubmittingUpdateStatus.set(false);
        this.closeUpdateStatusModal();
        // Refresh the detail view
        this.viewActivityDetails(currentDetail.id);
        // Refresh the list as well if needed
        const cycle = this.cycle();
        if (cycle) {
           this.cropService.getPlantingCycleActivities(cycle.id, 0, 100, {}).subscribe({
              next: (activitiesRes) => this.activities.set(activitiesRes.content)
           });
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.isSubmittingUpdateStatus.set(false);
      }
    });
  }

  showLogActivityModal = signal(false);`;

if(code.includes(targetLogic)) {
    code = code.replace(targetLogic, newLogic);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched component logic');
} else {
    console.log('Target logic not found');
}
