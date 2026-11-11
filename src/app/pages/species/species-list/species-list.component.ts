import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SpeciesService } from '../../../services/species.service';
import { SpeciesResponseModel, SpeciesType, PaginatedResponse } from '../../../models/species.model';

@Component({
  selector: 'app-species-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="p-6 mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Species</h1>
          <p class="text-slate-500 mt-1">Manage animal and crop species.</p>
        </div>
        <a routerLink="/species/create" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          Add Species
        </a>
      </div>
      
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 text-red-600 p-4 rounded-lg">
          {{ error() }}
        </div>
      } @else {
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-sm">
                  <th class="px-6 py-4 font-semibold text-slate-600">Species Name</th>
                  <th class="px-6 py-4 font-semibold text-slate-600">Scientific Name</th>
                  <th class="px-6 py-4 font-semibold text-slate-600">Category</th>
                  <th class="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of species(); track item.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                              [ngClass]="item.type === 'ANIMAL' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'">
                          <lucide-icon [name]="item.type === 'ANIMAL' ? 'paw-print' : 'sprout'" class="w-5 h-5"></lucide-icon>
                        </div>
                        <div>
                          <p class="font-bold text-slate-800">{{ item.commonName }}</p>
                          <p class="text-xs text-slate-500">{{ item.family ? item.family + ' - ' : '' }}{{ item.genus }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm text-slate-600 italic">{{ item.scientificName }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold"
                             [ngClass]="item.type === 'ANIMAL' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'">
                        {{ item.type === 'ANIMAL' ? 'Livestock' : 'Crop' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <a [routerLink]="['/species/view', item.id]" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50" title="View Details">
                          <lucide-icon name="eye" class="w-5 h-5"></lucide-icon>
                        </a>
                        <a [routerLink]="['/species/edit', item.id]" class="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50" title="Edit Species">
                          <lucide-icon name="pencil" class="w-5 h-5"></lucide-icon>
                        </a>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          @if (species().length === 0) {
            <div class="p-12 text-center text-slate-500">
              <lucide-icon name="sprout" class="w-12 h-12 mx-auto mb-4 opacity-20"></lucide-icon>
              <p class="font-medium">No species configured yet</p>
              <p class="text-sm">Click "Add Species" to create one.</p>
            </div>
          } @else {
            <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <p class="text-sm text-slate-600">
                Showing page <span class="font-medium">{{ currentPage() + 1 }}</span> of <span class="font-medium">{{ totalPages() }}</span> 
                (<span class="font-medium">{{ totalElements() }}</span> total)
              </p>
              <div class="flex gap-2">
                <button 
                  [disabled]="currentPage() === 0"
                  (click)="changePage(currentPage() - 1)"
                  class="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button 
                  [disabled]="currentPage() >= totalPages() - 1"
                  (click)="changePage(currentPage() + 1)"
                  class="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SpeciesListComponent implements OnInit {
  private speciesService = inject(SpeciesService);
  
  species = signal<SpeciesResponseModel[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);

  ngOnInit() {
    this.fetchSpecies();
  }

  fetchSpecies() {
    this.loading.set(true);
    this.error.set(null);
    this.speciesService.getAllSpecies(this.currentPage(), this.pageSize()).subscribe({
      next: (data) => {
        this.species.set(data.content || []);
        this.currentPage.set(data.currentPage);
        this.totalPages.set(data.pages);
        this.totalElements.set(data.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load species', err);
        this.error.set('Failed to load species.');
        this.loading.set(false);
      }
    });
  }
  
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.fetchSpecies();
    }
  }
}
