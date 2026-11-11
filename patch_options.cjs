const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', 'utf8');

const targetSelect = `<option value="">Select Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PLANNED">Planned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="SKIPPED">Skipped</option>
                            <option value="OVERDUE">Overdue</option>`;

const newSelect = `<option value="">Select Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="ASSIGNED">Assigned</option>
                            <option value="DUE">Due</option>
                            <option value="OVERDUE">Overdue</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="PARKED">Parked / On Hold</option>
                            <option value="PENDING_VERIFICATION">Pending Verification</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="SKIPPED">Skipped</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NOT_DONE">Not Done</option>`;

if(code.includes(targetSelect)) {
    code = code.replace(targetSelect, newSelect);
    fs.writeFileSync('src/app/pages/crops/planting-cycle-management/planting-cycle-management.component.ts', code);
    console.log('Patched modal options');
} else {
    console.log('Target select not found');
}
