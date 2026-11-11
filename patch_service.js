const fs = require('fs');
let code = fs.readFileSync('src/app/services/field-map.service.ts', 'utf8');

const target = `export interface MapElement {
  id: string;
  type: 'field' | 'block';
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;`;

const replacement = `export interface MapElement {
  id: string;
  type: 'field' | 'block';
  x: number;
  y: number;
  width: number;
  height: number;
  points?: number[];
  scaleX?: number;
  scaleY?: number;
  name: string;`;

code = code.replace(target, replacement);
fs.writeFileSync('src/app/services/field-map.service.ts', code);
