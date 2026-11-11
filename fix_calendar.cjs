const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/planting/planting-calendar.component.ts', 'utf8');

code = code.replace("import { Component, inject } from '@angular/core';", "import { Component, inject, OnInit } from '@angular/core';");
code = code.replace("export class PlantingCalendarComponent implements import('@angular/core').OnInit {", "export class PlantingCalendarComponent implements OnInit {");

fs.writeFileSync('src/app/pages/crops/planting/planting-calendar.component.ts', code);
console.log('Fixed calendar');
