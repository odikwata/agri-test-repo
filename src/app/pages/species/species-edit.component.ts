import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-species-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Edit Species</h1>
      <p class="text-slate-500">Edit form will be displayed here.</p>
    </div>
  `
})
export class SpeciesEditComponent {}
