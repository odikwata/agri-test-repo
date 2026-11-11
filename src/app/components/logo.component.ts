import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full">
      <defs>
        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8BC34A" />
          <stop offset="100%" stop-color="#03A9F4" />
        </linearGradient>
      </defs>
      
      <!-- Outer Circle -->
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#circleGrad)" stroke-width="6"/>
      
      <!-- Ground Layers -->
      <path d="M 20 140 Q 100 120 180 140 L 180 160 Q 100 180 20 160 Z" fill="#8BC34A" />
      <path d="M 30 150 Q 100 135 170 150 L 170 165 Q 100 185 30 165 Z" fill="#4CAF50" />
      <path d="M 40 160 Q 100 150 160 160 L 160 170 Q 100 190 40 170 Z" fill="#5D4037" />

      <!-- Tree Trunk / Slingshot -->
      <path d="M 85 175 C 85 140 70 110 50 90 L 65 85 C 80 100 90 120 95 140 C 100 120 110 100 125 85 L 140 90 C 120 110 105 140 105 175 Z" fill="#5D4037" />
      
      <!-- Slingshot bands -->
      <path d="M 50 90 L 50 70 L 65 70 L 65 85 Z" fill="#795548" />
      <path d="M 140 90 L 140 70 L 125 70 L 125 85 Z" fill="#795548" />
      
      <!-- Blue Water Drops on Slingshot -->
      <circle cx="57.5" cy="80" r="5" fill="#03A9F4" />
      <circle cx="132.5" cy="80" r="5" fill="#03A9F4" />

      <!-- Corn -->
      <path d="M 95 120 Q 85 90 95 60 Q 105 90 95 120 Z" fill="#FFC107" />
      <path d="M 95 120 Q 75 100 85 70 Q 90 100 95 120 Z" fill="#8BC34A" />
      <path d="M 95 120 Q 115 100 105 70 Q 100 100 95 120 Z" fill="#8BC34A" />

      <!-- Wheat -->
      <path d="M 95 120 Q 110 90 120 50" fill="none" stroke="#8BC34A" stroke-width="3" />
      <circle cx="115" cy="70" r="3" fill="#8BC34A" />
      <circle cx="110" cy="80" r="3" fill="#8BC34A" />
      <circle cx="120" cy="60" r="3" fill="#8BC34A" />
      <circle cx="105" cy="90" r="3" fill="#8BC34A" />

      <!-- Cow Silhouette (Left) -->
      <path d="M 35 125 L 45 125 L 50 130 L 60 130 L 65 140 L 65 150 L 60 150 L 60 145 L 40 145 L 40 150 L 35 150 Z" fill="#5D4037" />
      
      <!-- Pig Silhouette (Right) -->
      <path d="M 135 135 L 150 135 L 160 140 L 160 150 L 155 150 L 155 145 L 140 145 L 140 150 L 135 150 Z" fill="#5D4037" />
    </svg>
  `
})
export class LogoComponent {}
