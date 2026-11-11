const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target1 = `  cycleId = signal<string | null>(null);`;
const replacement1 = `  cycleId = signal<string | null>(null);\n  fieldId = signal<string | null>(null);`;

const target2 = `  ngOnInit() {
    this.route.paramMap.subscribe(params => {`;
const replacement2 = `  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.fieldId.set(params.get('fieldId'));
    });
    this.route.paramMap.subscribe(params => {`;

const target3 = `        <button routerLink="/crops" class="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
        </button>`;
const replacement3 = `        <a [routerLink]="fieldId() ? ['/crops/view', fieldId()] : ['/crops']" class="p-2 inline-block rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
          <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
        </a>`;

let changed = false;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    changed = true;
} else console.log('target1 not found');

if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
    changed = true;
} else console.log('target2 not found');

if (code.includes(target3)) {
    code = code.replace(target3, replacement3);
    changed = true;
} else console.log('target3 not found');

if (changed) {
    fs.writeFileSync(file, code);
    console.log('Fixed planting-cycle-management.component');
}
