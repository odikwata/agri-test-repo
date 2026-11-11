import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex items-center gap-8 border-b border-slate-200">
        <a routerLink="./overview" routerLinkActive="text-emerald-500 border-b-2 border-emerald-500" class="pb-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-all">Overview</a>
        <a routerLink="./list" routerLinkActive="text-emerald-500 border-b-2 border-emerald-500" class="pb-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-all">Employees</a>
      </div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class EmployeeComponent {}
