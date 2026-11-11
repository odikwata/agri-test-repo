import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-species-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">View Species</h1>
      <p class="text-slate-500">Species details will be displayed here.</p>
    </div>
  `
})
export class SpeciesViewComponent {}
