const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map/field-map.component.ts', 'utf8');

code = code.replace(/import \{ Component, inject, OnInit \} from '@angular\/core';/, "import { Component, inject, OnInit, ViewChild } from '@angular/core';");
code = code.replace(/export class FieldMapComponent implements OnInit \{/, "export class FieldMapComponent implements OnInit {\n  @ViewChild(GoogleMap) map!: GoogleMap;");

const replaceRegex = /this\.center = \{ lat: Number\(farm\.latitude\), lng: Number\(farm\.longitude\) \};/;
const replacement = `this.center = { lat: Number(farm.latitude), lng: Number(farm.longitude) };
            if (this.map && this.map.googleMap) {
              this.map.googleMap.setCenter(this.center);
            }`;
code = code.replace(replaceRegex, replacement);

fs.writeFileSync('src/app/pages/crops/field-map/field-map.component.ts', code);
