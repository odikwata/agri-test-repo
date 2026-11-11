const fs = require('fs');
const file = 'src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `    </div>
      </div>
    </div>

      <!-- History Modal -->`;
      
const replacement = `    </div>
      </div>

      <!-- History Modal -->`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed extra closing div');
} else {
    console.log('Target not found');
}
