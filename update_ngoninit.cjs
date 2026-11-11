const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `        this.cropService.getPlantingCycle(id).subscribe({
          next: (res) => {
            this.cycle.set(res);
            if (res.growthProgram?.id) {
              this.cropService.getGrowthProgramById(res.growthProgram.id).subscribe({
                next: (gp) => this.growthProgram.set(gp),
                error: (err) => console.error('Failed to load growth program', err)
              });
            }
          },
          error: (err) => console.error(err)
        });`;

const replacement = `        this.cropService.getPlantingCycle(id).subscribe({
          next: (res) => {
            this.cycle.set(res);
            if (res.growthProgram?.id) {
              this.cropService.getGrowthProgramById(res.growthProgram.id).subscribe({
                next: (gp) => this.growthProgram.set(gp),
                error: (err) => console.error('Failed to load growth program', err)
              });
            }
          },
          error: (err) => console.error(err)
        });

        this.cropService.getPlantingCycleActivities(id).subscribe({
          next: (res) => {
             this.activities.set(res.content);
          },
          error: (err) => console.error(err)
        });`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('ngOnInit updated');
} else {
    console.log('ngOnInit target not found');
}
