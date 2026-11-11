import { Component } from '@angular/core';
import { AnimalDossierComponent } from '../animal-dossier/animal-dossier.component';

@Component({
  selector: 'app-view-animal',
  standalone: true,
  imports: [AnimalDossierComponent],
  template: `<app-animal-dossier></app-animal-dossier>`,
})
export class ViewAnimalComponent {}
