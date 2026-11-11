import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feeding-programmes',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Feeding Programmes</h1>
          <p class="text-sm text-slate-500">Manage and monitor your livestock nutritional protocols and schedules.</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-200 transition-all border border-slate-200">
            <lucide-icon name="filter" class="w-4 h-4"></lucide-icon>
            Filter
          </button>
          <button [routerLink]="['create']" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20">
            <lucide-icon name="plus-circle" class="w-5 h-5"></lucide-icon>
            Create Programme
          </button>
        </div>
      </div>

      <!-- Sub-tabs -->
      <div class="flex gap-2">
        <button 
          (click)="activeSubTab.set('all')"
          [ngClass]="activeSubTab() === 'all' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all">
          All Protocols
        </button>
        <button 
          (click)="activeSubTab.set('active')"
          [ngClass]="activeSubTab() === 'active' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all">
          Active
        </button>
        <button 
          (click)="activeSubTab.set('drafts')"
          [ngClass]="activeSubTab() === 'drafts' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all">
          Drafts
        </button>
        <button 
          (click)="activeSubTab.set('archived')"
          [ngClass]="activeSubTab() === 'archived' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all">
          Archived
        </button>
      </div>

      <!-- Programme Cards -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Winter Growth Mix -->
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div class="h-48 bg-slate-100 relative overflow-hidden">
            <img src="https://picsum.photos/seed/cattle1/1200/400" alt="Cattle" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerpolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div class="p-8">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-1">Winter Growth Mix</h3>
                <div class="flex items-center gap-2 text-green-600 font-bold text-xs">
                  <lucide-icon name="users" class="w-4 h-4"></lucide-icon>
                  Target: Beef Cattle - Yearlings
                </div>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
            </div>
            <div class="flex gap-6 mb-8">
              <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                5 Components
              </div>
              <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <lucide-icon name="history" class="w-4 h-4"></lucide-icon>
                Last updated: 2 days ago
              </div>
            </div>
            <div class="flex gap-3">
              <button [routerLink]="['assign']" class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20">
                View Details
              </button>
              <button class="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-all border border-slate-200">
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- Lactation Support -->
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div class="h-48 bg-slate-100 relative overflow-hidden">
            <img src="https://picsum.photos/seed/cattle2/1200/400" alt="Cattle" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerpolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div class="p-8">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-1">Lactation Support</h3>
                <div class="flex items-center gap-2 text-green-600 font-bold text-xs">
                  <lucide-icon name="users" class="w-4 h-4"></lucide-icon>
                  Target: Dairy Cows - Mid-Lactation
                </div>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
            </div>
            <div class="flex gap-6 mb-8">
              <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                8 Components
              </div>
              <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <lucide-icon name="history" class="w-4 h-4"></lucide-icon>
                Last updated: 5 hours ago
              </div>
            </div>
            <div class="flex gap-3">
              <button [routerLink]="['assign']" class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20">
                View Details
              </button>
              <button class="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-all border border-slate-200">
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- Calf Starter Phase 2 -->
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div class="h-48 bg-slate-100 relative overflow-hidden">
            <img src="https://picsum.photos/seed/cattle3/1200/400" alt="Cattle" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerpolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div class="p-8">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-1">Calf Starter Phase 2</h3>
                <div class="flex items-center gap-2 text-green-600 font-bold text-xs">
                  <lucide-icon name="users" class="w-4 h-4"></lucide-icon>
                  Target: Weaned Calves
                </div>
              </div>
              <span class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">Draft</span>
            </div>
            <div class="flex gap-6 mb-8">
              <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <lucide-icon name="flask-conical" class="w-4 h-4"></lucide-icon>
                4 Components
              </div>
              <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <lucide-icon name="history" class="w-4 h-4"></lucide-icon>
                Last updated: 1 week ago
              </div>
            </div>
            <div class="flex gap-3">
              <button [routerLink]="['assign']" class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20">
                View Details
              </button>
              <button class="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-all border border-slate-200">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeedingProgrammesComponent {
  activeSubTab = signal('all');
}
