import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
          <p class="text-slate-500 text-sm font-medium">Manage and view all farm employees across departments.</p>
        </div>
        <button class="bg-[#00FF22] hover:bg-[#00E61F] text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 uppercase tracking-widest">
          <lucide-icon name="user-plus" class="w-4 h-4"></lucide-icon>
          Add Employee
        </button>
      </div>

      <!-- Tabs & Filters -->
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-8 border-b border-slate-200">
          <button class="pb-4 text-sm font-black text-emerald-500 border-b-2 border-emerald-500">All Staff (42)</button>
          <button class="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Crops</button>
          <button class="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Livestock</button>
          <button class="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Maintenance</button>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative">
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              Role: All
              <lucide-icon name="chevron-down" class="w-3 h-3"></lucide-icon>
            </button>
          </div>
          <div class="relative">
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              Status: Active
              <lucide-icon name="chevron-down" class="w-3 h-3"></lucide-icon>
            </button>
          </div>
          <div class="relative">
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              Sorted By: Name
              <lucide-icon name="align-left" class="w-3 h-3"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Role</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr *ngFor="let emp of employees" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    <img [src]="emp.avatar" [alt]="emp.name" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900">{{ emp.name }}</span>
                    <span class="text-[10px] font-bold text-slate-400">{{ emp.email }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-700">{{ emp.department }}</span>
                  <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{{ emp.role }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span [class]="getStatusClass(emp.status)" class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {{ emp.status }}
                </span>
              </td>
              <td class="px-8 py-6">
                <button class="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <lucide-icon name="more-horizontal" class="w-5 h-5"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p class="text-xs font-bold text-slate-400">Showing 1 to 5 of 42 employees</p>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white rounded-lg transition-all">Previous</button>
            <button class="w-8 h-8 bg-emerald-500 text-white text-xs font-black rounded-lg shadow-lg shadow-emerald-500/20">1</button>
            <button class="w-8 h-8 hover:bg-white text-slate-500 text-xs font-bold rounded-lg transition-all">2</button>
            <button class="w-8 h-8 hover:bg-white text-slate-500 text-xs font-bold rounded-lg transition-all">3</button>
            <button class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white rounded-lg transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class EmployeeListComponent {
  employees = [
    {
      name: 'Robert Miller',
      email: 'robert.m@slingshot.farm',
      avatar: 'https://i.pravatar.cc/150?u=robert',
      department: 'Crops',
      role: 'Farm Manager',
      status: 'On Field'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@slingshot.farm',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      department: 'Livestock',
      role: 'Specialist',
      status: 'Available'
    },
    {
      name: 'David Chen',
      email: 'david.c@slingshot.farm',
      avatar: 'https://i.pravatar.cc/150?u=david',
      department: 'Maintenance',
      role: 'Lead Technician',
      status: 'In Workshop'
    },
    {
      name: 'Maria Garcia',
      email: 'maria.g@slingshot.farm',
      avatar: 'https://i.pravatar.cc/150?u=maria',
      department: 'Crops',
      role: 'Field Worker',
      status: 'Off Duty'
    },
    {
      name: 'James Wilson',
      email: 'james.w@slingshot.farm',
      avatar: 'https://i.pravatar.cc/150?u=james',
      department: 'Admin',
      role: 'HR Coordinator',
      status: 'At Office'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'On Field': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Available': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'In Workshop': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Off Duty': return 'bg-slate-100 text-slate-500 border border-slate-200';
      case 'At Office': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
