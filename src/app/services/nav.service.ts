import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private activeTopMenu = new BehaviorSubject<string>('Livestock');
  activeTopMenu$ = this.activeTopMenu.asObservable();

  private sideMenuItems = new BehaviorSubject<NavItem[]>([]);
  sideMenuItems$ = this.sideMenuItems.asObservable();

  private menus: Record<string, NavItem[]> = {
    'Dashboard': [
      { label: 'Overview', icon: 'layout-dashboard', route: '/dashboard' },
      { label: 'Tasks', icon: 'clipboard-list', route: '/tasks' },
      { label: 'Analytics', icon: 'bar-chart-3', route: '/dashboard/analytics' },
      { label: 'Reports', icon: 'file-text', route: '/dashboard/reports' }
    ],
    'Livestock': [
      { label: 'Overview', icon: 'paw-print', route: '/livestock' },
      { label: 'Register Animal', icon: 'plus-circle', route: '/livestock/add' },
      { label: 'Animal Dossier', icon: 'file-text', route: '/livestock/dossier' },
      { label: 'Groups & Batches', icon: 'users', route: '/livestock/groups' },
      { label: 'Health Records', icon: 'heart-pulse', route: '/livestock/health' },
      { label: 'Breeding', icon: 'git-merge', route: '/livestock/breeding' },
      { label: 'Feed Management', icon: 'utensils', route: '/livestock/feed' },
      { label: 'Pasture Rotation', icon: 'map', route: '/livestock/pasture' }
    ],
    'Crops': [
      { label: 'Field Map', icon: 'map', route: '/crops' },
      { label: 'Planting Schedule', icon: 'calendar', route: '/crops/planting' },
      { label: 'Harvesting', icon: 'wheat', route: '/crops/harvest' },
      { label: 'Soil Rating', icon: 'flask-conical', route: '/crops/soil-rating' },
      { label: 'Accounting', icon: 'calculator', route: '/crops/accounting' }
    ],
    'Equipment': [
      { label: 'Inventory', icon: 'package', route: '/equipment/inventory' },
      { label: 'Maintenance', icon: 'settings', route: '/equipment/maintenance' },
      { label: 'Fuel Tracking', icon: 'fuel', route: '/equipment/fuel' }
    ],
    'Settings': [
      { label: 'Profile', icon: 'user', route: '/settings' },
      { label: 'Farms', icon: 'home', route: '/farms' },
      { label: 'Species', icon: 'list', route: '/species' },
      { label: 'Notifications', icon: 'bell', route: '/settings/notifications' }
    ],
    'Human Resource': [
      { label: 'Employee', icon: 'users', route: '/hr/employee' },
      { label: 'Payroll', icon: 'banknote', route: '/hr/payroll' },
      { label: 'Leave Management', icon: 'calendar-off', route: '/hr/leave' },
      { label: 'Performance', icon: 'trending-up', route: '/hr/performance' }
    ]
  };

  setActiveTopMenu(menu: string) {
    this.activeTopMenu.next(menu);
    this.sideMenuItems.next(this.menus[menu] || []);
  }

  constructor() {
    this.setActiveTopMenu('Livestock');
  }
}
