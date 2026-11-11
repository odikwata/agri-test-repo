const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetMethods = `  getStatusClass(status: string): string {
      switch (status) {
          case 'COMPLETED': return 'bg-blue-100 text-blue-700';
          case 'IN_PROGRESS': return 'bg-emerald-100 text-emerald-700';
          case 'OVERDUE': return 'bg-red-100 text-red-700';
          case 'CANCELLED': case 'SKIPPED': return 'bg-slate-200 text-slate-600';
          default: return 'bg-amber-100 text-amber-700';
      }
  }

  getStatusLabel(status: string): string {
      if (!status) return 'Unknown';
      return status.replace(/_/g, ' ').replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }`;

const newMethods = `  getStatusClass(status: string): string {
      switch (status) {
          case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
          case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
          case 'OVERDUE': case 'NOT_DONE': return 'bg-red-100 text-red-700';
          case 'CANCELLED': case 'SKIPPED': case 'PARKED': case 'DRAFT': return 'bg-slate-200 text-slate-600';
          case 'PENDING_VERIFICATION': case 'DUE': return 'bg-amber-100 text-amber-700';
          case 'SCHEDULED': case 'ASSIGNED': return 'bg-indigo-100 text-indigo-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  }

  getStatusLabel(status: string): string {
      if (!status) return 'Unknown';
      if (status === 'PARKED') return 'Parked / On Hold';
      return status.replace(/_/g, ' ').replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }`;

if(code.includes(targetMethods)) {
    code = code.replace(targetMethods, newMethods);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched status methods');
} else {
    console.log('Target methods not found');
}
