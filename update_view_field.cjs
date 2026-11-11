const fs = require('fs');

let code = fs.readFileSync('src/app/pages/crops/view-field/view-field.component.ts', 'utf8');

const sizeInfoRegex = /<div class="flex items-center gap-3">\s*<div class="w-10 h-10 rounded-xl bg-primary\/10 flex items-center justify-center shrink-0">\s*<lucide-icon name="maximize" class="w-5 h-5 text-primary"><\/lucide-icon>\s*<\/div>\s*<div>\s*<p class="text-sm font-bold text-slate-800">Size<\/p>\s*<p class="text-xs text-slate-500">{{ field\(\)\?\.size \|\| 0 }} Hectares<\/p>\s*<\/div>\s*<\/div>/;

const newSizeInfo = `<div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <lucide-icon name="maximize" class="w-5 h-5 text-primary"></lucide-icon>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-800">Size</p>
                      <p class="text-xs text-slate-500">{{ field()?.size || 0 }} Hectares</p>
                    </div>
                  </div>

                  @if (field()?.attributes) {
                    @for (attr of objectKeys(field()!.attributes!); track attr) {
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <lucide-icon name="info" class="w-5 h-5 text-primary"></lucide-icon>
                        </div>
                        <div>
                          <p class="text-sm font-bold text-slate-800">{{ attr }}</p>
                          <p class="text-xs text-slate-500">{{ field()!.attributes![attr] }}</p>
                        </div>
                      </div>
                    }
                  }`;

code = code.replace(sizeInfoRegex, newSizeInfo);

const classBodyRegex = /fieldId = signal<string \| null>\(null\);/;
code = code.replace(classBodyRegex, `  objectKeys(obj: any): string[] { return obj ? Object.keys(obj) : []; }\n  fieldId = signal<string | null>(null);`);

fs.writeFileSync('src/app/pages/crops/view-field/view-field.component.ts', code);
