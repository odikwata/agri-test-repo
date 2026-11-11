const fs = require('fs');
let code = fs.readFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', 'utf8');

code = code.replace("import { Component, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';", "import { Component, ViewChild, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';");

code = code.replace("this.cdr.markForCheck();", "(this.cdr as any).markForCheck();");

fs.writeFileSync('src/app/pages/crops/field-map-edit/field-map-edit.component.ts', code);
