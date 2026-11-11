import { Component, EventEmitter, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SpeciesService } from '../../../../services/species.service';
import { SpeciesResponseModel, SpeciesType } from '../../../../models/species.model';

@Component({
  selector: 'app-add-species-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-xl bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add Species</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-500">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
        
        <form [formGroup]="speciesForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Species</label>
              <select formControlName="speciesId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled selected>Select a species</option>
                @for (species of speciesList(); track species.id) {
                  <option [value]="species.id">{{ species.commonName }} ({{ species.scientificName }})</option>
                }
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Initial Count</label>
              <input type="number" formControlName="count" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" [disabled]="!speciesForm.valid || isLoading()" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
              @if (isLoading()) {
                <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
              }
              Add Species
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddSpeciesModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  private speciesService = inject(SpeciesService);
  private fb = inject(FormBuilder);
  
  speciesForm: FormGroup;
  speciesList = signal<SpeciesResponseModel[]>([]);
  isLoading = signal(false);
  
  constructor() {
    this.speciesForm = this.fb.group({
      speciesId: ['', Validators.required],
      count: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit() {
    this.loadSpecies();
  }
  
  loadSpecies() {
    this.isLoading.set(true);
    this.speciesService.getAllSpecies().subscribe({
      next: (data) => {
        this.speciesList.set(data.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load species', err);
        this.isLoading.set(false);
        // Fallback to some mock data if API fails for demo purposes
        this.speciesList.set([
          { id: 's1', commonName: 'Cattle', scientificName: 'Bos taurus', type: SpeciesType.ANIMAL, genus: 'Bos', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's2', commonName: 'Sheep', scientificName: 'Ovis aries', type: SpeciesType.ANIMAL, genus: 'Ovis', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's3', commonName: 'Goats', scientificName: 'Capra hircus', type: SpeciesType.ANIMAL, genus: 'Capra', family: 'Bovidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's4', commonName: 'Poultry', scientificName: 'Gallus gallus domesticus', type: SpeciesType.ANIMAL, genus: 'Gallus', family: 'Phasianidae', speciesSpecificData: {}, speciesConfigData: {} },
          { id: 's5', commonName: 'Bees', scientificName: 'Apis mellifera', type: SpeciesType.ANIMAL, genus: 'Apis', family: 'Apidae', speciesSpecificData: {}, speciesConfigData: {} }
        ]);
      }
    });
  }
  
  onSubmit() {
    if (this.speciesForm.valid) {
      const selectedSpeciesId = this.speciesForm.value.speciesId;
      const selectedSpecies = this.speciesList().find(s => s.id === selectedSpeciesId);
      
      this.save.emit({
        speciesId: selectedSpeciesId,
        name: selectedSpecies ? selectedSpecies.commonName : 'Unknown',
        count: this.speciesForm.value.count
      });
    }
  }
}
