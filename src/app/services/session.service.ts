import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private getInitialFarmId(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem('slingshot_active_farm');
      } catch {
        return null;
      }
    }
    return null;
  }

  private selectedFarmIdSignal = signal<string | null>(this.getInitialFarmId());
  
  selectedFarmId = computed(() => this.selectedFarmIdSignal());

  setFarm(farmId: string) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('slingshot_active_farm', farmId);
      } catch {}
    }
    this.selectedFarmIdSignal.set(farmId);
  }

  clearFarm() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('slingshot_active_farm');
      } catch {}
    }
    this.selectedFarmIdSignal.set(null);
  }
}
