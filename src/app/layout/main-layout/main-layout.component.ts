import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs/operators';
import { LogoComponent } from '../../components/logo.component';
import { FormsModule } from '@angular/forms';
import { FarmService, ApiFarmResponse } from '../../services/farm.service';
import { SessionService } from '../../services/session.service';


import { SoilNotificationService } from '../../services/soil-notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  navService = inject(NavService);
  authService = inject(AuthService);
  router = inject(Router);
  soilService = inject(SoilNotificationService);

  farmService = inject(FarmService);
  sessionService = inject(SessionService);
  farms: ApiFarmResponse[] = [];

  topMenus = [
    { label: 'Dashboard', slug: 'dashboard' },
    { label: 'Livestock', slug: 'livestock' },
    { label: 'Crops', slug: 'crops' },
    { label: 'Equipment', slug: 'equipment' },
    { label: 'Human Resource', slug: 'hr' },
    { label: 'Settings', slug: 'settings' }
  ];
  
  showUserMenu = signal(false);
  showNotificationsMenu = signal(false);

  toggleNotificationsMenu() {
    this.showNotificationsMenu.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.showUserMenu.set(false);
    }
    if (!target.closest('.notification-menu-container')) {
      this.showNotificationsMenu.set(false);
    }
  }
  
  ngOnInit() {
    // Sync menu with current route on load and navigation
    this.syncMenuWithRoute(this.router.url);

    this.farmService.getAllFarms('org-doasis-01').subscribe({
      next: (data) => {
        this.farms = data;
        if (!this.sessionService.selectedFarmId() && data.length > 0) {
          this.sessionService.setFarm(data[0].id);
        }
      },
      error: (err) => {
        console.warn('Failed to load farms in main layout:', err?.message || err);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: any) => {
        this.syncMenuWithRoute(event.urlAfterRedirects);
      },
      error: () => {}
    });
  }

  syncMenuWithRoute(url: string) {
    let activeMenu = this.topMenus.find(menu => 
      url.toLowerCase().includes(menu.slug)
    );
    if (!activeMenu && (url.toLowerCase().includes('/farms') || url.toLowerCase().includes('/species'))) {
      activeMenu = this.topMenus.find(menu => menu.slug === 'settings');
    }
    if (activeMenu) {
      this.navService.setActiveTopMenu(activeMenu.label);
    }
  }

  onTopMenuClick(menuLabel: string) {
    this.navService.setActiveTopMenu(menuLabel);
  }

  
  onFarmChange(farmId: string) {
    this.sessionService.setFarm(farmId);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
