const fs = require('fs');

let tsCode = fs.readFileSync('src/app/layout/main-layout/main-layout.component.ts', 'utf8');

const tsImports = `import { FormsModule } from '@angular/forms';
import { FarmService, ApiFarmResponse } from '../../services/farm.service';
import { SessionService } from '../../services/session.service';
`;
tsCode = tsCode.replace(/import \{ LogoComponent \} from '\.\.\/\.\.\/components\/logo\.component';/, "import { LogoComponent } from '../../components/logo.component';\n" + tsImports);

tsCode = tsCode.replace(/imports: \[CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent\],/, "imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],");

const injections = `
  farmService = inject(FarmService);
  sessionService = inject(SessionService);
  farms: ApiFarmResponse[] = [];
`;
tsCode = tsCode.replace(/router = inject\(Router\);/, "router = inject(Router);\n" + injections);

const initFarms = `
    this.farmService.getAllFarms().subscribe({
      next: (data) => {
        this.farms = data;
        if (!this.sessionService.selectedFarmId() && data.length > 0) {
          this.sessionService.setFarm(data[0].id);
        }
      }
    });
`;
tsCode = tsCode.replace(/this\.syncMenuWithRoute\(this\.router\.url\);/, "this.syncMenuWithRoute(this.router.url);\n" + initFarms);

const onFarmChange = `
  onFarmChange(farmId: string) {
    this.sessionService.setFarm(farmId);
  }
`;
tsCode = tsCode.replace(/logout\(\) \{/, onFarmChange + "\n  logout() {");

fs.writeFileSync('src/app/layout/main-layout/main-layout.component.ts', tsCode);

let htmlCode = fs.readFileSync('src/app/layout/main-layout/main-layout.component.html', 'utf8');

const contextMenuUpdate = `
          <div class="px-4 py-3 border-b border-slate-100 mb-2">
            <p class="text-sm font-black text-slate-900">{{ authService.currentUser()?.firstname || 'Guest' }} {{ authService.currentUser()?.lastname || 'User' }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Farm Manager</p>
          </div>
          
          <div class="px-4 py-2 border-b border-slate-100 mb-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Active Farm</label>
            <div class="relative">
              <select 
                [ngModel]="sessionService.selectedFarmId()" 
                (ngModelChange)="onFarmChange($event)"
                class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-8">
                <option [ngValue]="null" disabled>Select a farm...</option>
                @for (farm of farms; track farm.id) {
                  <option [value]="farm.id">{{ farm.name }}</option>
                }
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                <lucide-icon name="chevron-down" class="w-3 h-3"></lucide-icon>
              </div>
            </div>
          </div>
`;

htmlCode = htmlCode.replace(/<div class="px-4 py-3 border-b border-slate-100 mb-2">[\s\S]*?<\/div>/, contextMenuUpdate);

fs.writeFileSync('src/app/layout/main-layout/main-layout.component.html', htmlCode);

