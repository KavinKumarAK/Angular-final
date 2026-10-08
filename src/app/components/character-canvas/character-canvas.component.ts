import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterStateService } from '../../services/character-state.service';

@Component({
  selector: 'app-character-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="canvas-container card-glass">
      <!-- Header -->
      <div class="header-hud">
        <span class="archetype-tag" [style.borderColor]="state.selectedClass().badgeColor">
          <span class="archetype-dot" [style.backgroundColor]="state.selectedClass().badgeColor"></span>
          {{ state.selectedClass().name.toUpperCase() }}
        </span>

        <h2 class="character-bold-title">
          {{ (state.characterName() || 'Nameless Hero').toUpperCase() }}
        </h2>

        <p class="character-subtitle">
          {{ state.characterTitle() }}
        </p>
      </div>

      <!-- Central Character Display -->
      <div
        class="character-display-box"
        (click)="state.triggerAttack()"
        title="Click the sprite to trigger the attack animation"
      >
        <button
          class="attack-action-btn"
          (click)="$event.stopPropagation(); state.triggerAttack()"
          title="Trigger attack animation"
        >
          Attack
        </button>

        <svg
          class="character-svg float-bob"
          [class.anim-attacking]="state.isAttacking()"
          viewBox="0 0 400 460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFF7ED" stop-opacity="0.9" />
              <stop offset="35%" stop-color="#E06A2B" stop-opacity="0.6" />
              <stop offset="70%" stop-color="#B23A1F" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#5C1A10" stop-opacity="0" />
            </radialGradient>

            <radialGradient id="frostGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
              <stop offset="35%" stop-color="#6FA8DC" stop-opacity="0.65" />
              <stop offset="70%" stop-color="#2F6FA8" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#0E2434" stop-opacity="0" />
            </radialGradient>

            <radialGradient id="lightningGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FCF3D4" stop-opacity="0.9" />
              <stop offset="40%" stop-color="#C9A227" stop-opacity="0.6" />
              <stop offset="75%" stop-color="#8A6C14" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#3B2F0A" stop-opacity="0" />
            </radialGradient>

            <radialGradient id="voidGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#E4D9F8" stop-opacity="0.85" />
              <stop offset="40%" stop-color="#8B7CF0" stop-opacity="0.6" />
              <stop offset="75%" stop-color="#4B3E8C" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#1F1840" stop-opacity="0" />
            </radialGradient>

            <linearGradient id="metalPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94A3B8" />
              <stop offset="30%" stop-color="#E2E8F0" />
              <stop offset="60%" stop-color="#475569" />
              <stop offset="100%" stop-color="#1E293B" />
            </linearGradient>

            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F0DFA0" />
              <stop offset="40%" stop-color="#D3A343" />
              <stop offset="80%" stop-color="#9A7521" />
              <stop offset="100%" stop-color="#5E4612" />
            </linearGradient>

            <linearGradient id="leatherTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#44403C" />
              <stop offset="50%" stop-color="#292524" />
              <stop offset="100%" stop-color="#1C1917" />
            </linearGradient>

            <linearGradient id="hairShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="40%" stop-color="#334155" />
              <stop offset="100%" stop-color="#0F172A" />
            </linearGradient>

            <radialGradient id="eyeIris" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#6FA8DC" />
              <stop offset="65%" stop-color="#2F6FA8" />
              <stop offset="100%" stop-color="#0E2434" />
            </radialGradient>

            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Ground shadow -->
          <ellipse cx="200" cy="425" rx="85" ry="14" fill="rgba(0, 0, 0, 0.55)" />

          @if (state.powerActive()) {
            <g class="power-aura-group">
              @if (state.selectedPower().element === 'flame') {
                <circle cx="200" cy="225" r="145" fill="url(#flameGlow)" />
                <circle cx="200" cy="225" r="118" stroke="#E06A2B" stroke-width="2" stroke-dasharray="8 6" opacity="0.7" class="aura-spinner" />
                <polygon points="190,75 200,45 210,75" fill="#E06A2B" opacity="0.8" />
                <polygon points="110,180 85,160 115,165" fill="#E06A2B" opacity="0.8" />
                <polygon points="290,180 315,160 285,165" fill="#E06A2B" opacity="0.8" />
              } @else if (state.selectedPower().element === 'frost') {
                <circle cx="200" cy="225" r="145" fill="url(#frostGlow)" />
                <circle cx="200" cy="225" r="120" stroke="#6FA8DC" stroke-width="2.5" stroke-dasharray="14 10" opacity="0.75" class="aura-spinner" />
                <polygon points="195,65 200,40 205,65 200,90" fill="#CFE3F5" />
                <polygon points="100,170 75,175 100,180 120,175" fill="#CFE3F5" />
                <polygon points="300,170 325,175 300,180 280,175" fill="#CFE3F5" />
              } @else if (state.selectedPower().element === 'lightning') {
                <circle cx="200" cy="225" r="145" fill="url(#lightningGlow)" />
                <polyline points="180,55 195,90 185,110 215,145" stroke="#C9A227" stroke-width="3" fill="none" />
                <polyline points="85,195 115,210 100,225 135,235" stroke="#C9A227" stroke-width="3" fill="none" />
                <polyline points="315,195 285,210 300,225 265,235" stroke="#C9A227" stroke-width="3" fill="none" />
              } @else {
                <circle cx="200" cy="225" r="150" fill="url(#voidGlow)" />
                <circle cx="200" cy="225" r="122" stroke="#8B7CF0" stroke-width="3" stroke-dasharray="20 12" opacity="0.75" class="aura-spinner-reverse" />
              }
            </g>
          }

          <!-- Back layer: cape / robe -->
          @if (state.selectedOutfit().type === 'robe') {
            <path d="M 150 205 Q 120 340 135 410 Q 200 425 265 410 Q 280 340 250 205 Z" fill="#2E1065" opacity="0.95" />
          } @else if (state.selectedOutfit().type === 'plate') {
            <path d="M 155 205 Q 130 320 140 395 Q 200 405 260 395 Q 270 320 245 205 Z" fill="#7F2A2A" opacity="0.8" />
          }

          <g id="body">
            <!-- Legs -->
            <path d="M 162 315 L 160 380 L 150 415 L 188 415 L 188 380 L 192 315 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />
            <path d="M 208 315 L 212 380 L 212 415 L 250 415 L 240 380 L 238 315 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            <circle cx="174" cy="355" r="9" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1" />
            <circle cx="226" cy="355" r="9" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1" />

            <path d="M 148 408 L 188 408 L 192 422 L 142 422 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <path d="M 212 408 L 252 408 L 258 422 L 208 422 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <line x1="140" y1="422" x2="194" y2="422" stroke="#0F172A" stroke-width="3" />
            <line x1="206" y1="422" x2="260" y2="422" stroke="#0F172A" stroke-width="3" />

            <!-- Torso -->
            <path d="M 148 185 Q 140 250 162 315 L 238 315 Q 260 250 252 185 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            @if (state.selectedOutfit().type === 'plate') {
              <path d="M 152 188 Q 200 215 248 188 L 240 270 Q 200 295 160 270 Z" fill="url(#metalPlate)" stroke="#D3A343" stroke-width="2" />
              <polygon points="200,215 208,235 200,248 192,235" fill="url(#goldTrim)" />
              <circle cx="200" cy="235" r="4" fill="#B24545" />
              <path d="M 165 240 Q 200 255 235 240" fill="none" stroke="#D3A343" stroke-width="1.5" />
              <circle cx="160" cy="205" r="2.5" fill="#F0DFA0" />
              <circle cx="240" cy="205" r="2.5" fill="#F0DFA0" />
              <rect x="160" y="295" width="80" height="15" rx="3" fill="#1C1917" stroke="#D3A343" stroke-width="1.5" />
              <rect x="192" y="292" width="16" height="21" rx="2" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1" />
              <polygon points="162,310 188,310 182,340 166,340" fill="url(#metalPlate)" stroke="#D3A343" stroke-width="1" />
              <polygon points="212,310 238,310 234,340 218,340" fill="url(#metalPlate)" stroke="#D3A343" stroke-width="1" />
            } @else if (state.selectedOutfit().type === 'robe') {
              <path d="M 172 188 L 172 335 L 228 335 L 228 188 Z" [style.fill]="state.selectedOutfit().trimColor" />
              <line x1="172" y1="188" x2="172" y2="335" stroke="url(#goldTrim)" stroke-width="3" />
              <line x1="228" y1="188" x2="228" y2="335" stroke="url(#goldTrim)" stroke-width="3" />
              <text x="195" y="240" font-size="14" fill="#F0DFA0" font-family="serif">✦</text>
              <text x="195" y="275" font-size="14" fill="#F0DFA0" font-family="serif">❖</text>
              <text x="195" y="310" font-size="14" fill="#F0DFA0" font-family="serif">✦</text>
              <circle cx="200" cy="205" r="10" fill="#6FA8DC" stroke="#FFFFFF" stroke-width="2" filter="url(#softGlow)" />
              <rect x="160" y="285" width="80" height="12" rx="2" fill="url(#goldTrim)" />
              <path d="M 188 297 L 184 350 L 196 350 L 192 297 Z" fill="url(#goldTrim)" />
            } @else if (state.selectedOutfit().type === 'cyber') {
              <path d="M 160 195 L 200 220 L 240 195 L 235 285 L 200 305 L 165 285 Z" fill="#0F172A" stroke="#4C8DFF" stroke-width="2" />
              <line x1="170" y1="205" x2="195" y2="245" stroke="#4C8DFF" stroke-width="3.5" filter="url(#softGlow)" />
              <line x1="230" y1="205" x2="205" y2="245" stroke="#4C8DFF" stroke-width="3.5" filter="url(#softGlow)" />
              <line x1="200" y1="260" x2="200" y2="300" stroke="#4C8DFF" stroke-width="3" filter="url(#softGlow)" />
              <polygon points="200,230 216,245 200,260 184,245" fill="#4C8DFF" stroke="#FFFFFF" stroke-width="2" filter="url(#softGlow)" />
              <circle cx="200" cy="245" r="4" fill="#FFFFFF" />
              <rect x="162" y="295" width="76" height="14" rx="3" fill="#1E293B" stroke="#4C8DFF" stroke-width="1.5" />
            } @else {
              <path d="M 152 190 L 248 190 L 240 290 L 160 290 Z" fill="url(#leatherTone)" stroke="#2FA08A" stroke-width="1.5" />
              <line x1="152" y1="195" x2="240" y2="285" stroke="#78716C" stroke-width="7" />
              <line x1="152" y1="195" x2="240" y2="285" stroke="#44403C" stroke-width="3" />
              <line x1="248" y1="195" x2="160" y2="285" stroke="#78716C" stroke-width="7" />
              <line x1="248" y1="195" x2="160" y2="285" stroke="#44403C" stroke-width="3" />
              <polygon points="180,225 186,238 183,248 177,235" fill="#E2E8F0" stroke="#0F172A" stroke-width="1" />
              <polygon points="214,225 220,238 217,248 211,235" fill="#E2E8F0" stroke="#0F172A" stroke-width="1" />
              <circle cx="200" cy="240" r="8" [style.fill]="state.selectedOutfit().trimColor" stroke="#F0DFA0" stroke-width="1.5" />
            }

            <!-- Pauldrons -->
            <path d="M 130 180 Q 148 168 165 185 L 160 215 Q 140 225 125 205 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <path d="M 125 200 Q 140 215 155 205 L 150 225 Q 135 235 122 220 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />
            <path d="M 270 180 Q 252 168 235 185 L 240 215 Q 260 225 275 205 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <path d="M 275 200 Q 260 215 245 205 L 250 225 Q 265 235 278 220 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            <!-- Neck -->
            <path d="M 186 168 L 186 195 Q 200 200 214 195 L 214 168 Z" [style.fill]="state.skinColor()" />
            <polygon points="186,168 214,168 206,182 194,182" fill="rgba(0,0,0,0.22)" />
            <path d="M 178 194 Q 192 198 200 196 Q 208 198 222 194" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2" stroke-linecap="round" />

            <!-- Head -->
            <path d="M 166 120 C 164 150 175 174 200 174 C 225 174 236 150 234 120 C 234 85 166 85 166 120 Z" [style.fill]="state.skinColor()" stroke="#0F172A" stroke-width="1.5" />
            <path d="M 166 122 C 160 122 159 138 166 142 Z" [style.fill]="state.skinColor()" stroke="#0F172A" stroke-width="1" />
            <path d="M 234 122 C 240 122 241 138 234 142 Z" [style.fill]="state.skinColor()" stroke="#0F172A" stroke-width="1" />

            <g class="hero-face">
              <path d="M 174 120 Q 185 116 192 121" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round" />
              <path d="M 226 120 Q 215 116 208 121" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round" />

              <ellipse cx="184" cy="130" rx="8" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
              <circle cx="184" cy="130" r="4.5" fill="url(#eyeIris)" />
              <circle cx="184" cy="130" r="2.2" fill="#0B0E14" />
              <circle cx="182.5" cy="128.5" r="1.5" fill="#FFFFFF" />
              <circle cx="185.5" cy="132" r="0.8" fill="#FFFFFF" />
              <path d="M 176 127 Q 184 123 192 127" fill="none" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />

              <ellipse cx="216" cy="130" rx="8" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
              <circle cx="216" cy="130" r="4.5" fill="url(#eyeIris)" />
              <circle cx="216" cy="130" r="2.2" fill="#0B0E14" />
              <circle cx="214.5" cy="128.5" r="1.5" fill="#FFFFFF" />
              <circle cx="217.5" cy="132" r="0.8" fill="#FFFFFF" />
              <path d="M 208 127 Q 216 123 224 127" fill="none" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />

              <path d="M 200 128 L 198 142 L 202 143" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linecap="round" />
              <path d="M 193 154 Q 200 157 207 154" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
              <path d="M 197 158 Q 200 160 203 158" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1.5" />
            </g>

            <g id="hero-hair">
              <path d="M 164 105 Q 155 130 162 145 Q 165 125 168 115 Z" fill="url(#hairShade)" />
              <path d="M 236 105 Q 245 130 238 145 Q 235 125 232 115 Z" fill="url(#hairShade)" />
              <path d="M 166 112 Q 175 90 200 90 Q 225 90 234 112 Q 225 102 215 105 Q 200 95 185 105 Q 175 102 166 112 Z" fill="url(#hairShade)" />
              <path d="M 175 95 L 180 115 L 188 100 L 196 116 L 205 98 L 214 115 L 222 96 Z" fill="url(#hairShade)" />
            </g>

            <!-- Arms -->
            <path d="M 145 195 Q 118 230 102 268" fill="none" stroke-width="20" [style.stroke]="state.skinColor()" stroke-linecap="round" />
            <path d="M 132 215 L 102 265 L 112 272 L 142 222 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <circle cx="100" cy="270" r="13" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <rect x="92" y="263" width="16" height="6" rx="2" fill="url(#goldTrim)" />

            <path d="M 255 195 Q 282 230 298 268" fill="none" stroke-width="20" [style.stroke]="state.skinColor()" stroke-linecap="round" />
            <path d="M 268 215 L 298 265 L 288 272 L 258 222 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <circle cx="300" cy="270" r="13" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <rect x="292" y="263" width="16" height="6" rx="2" fill="url(#goldTrim)" />
          </g>

          <!-- Headgear -->
          <g id="headgear">
            @if (state.selectedHat().type === 'helm') {
              <path d="M 160 115 Q 155 160 170 172 Q 200 178 230 172 Q 245 160 240 115 Z" fill="#475569" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="2 2" />
              <path d="M 162 125 C 162 70 238 70 238 125 Z" fill="url(#metalPlate)" stroke="#1E293B" stroke-width="2" />
              <path d="M 160 118 Q 200 112 240 118 L 240 128 Q 200 122 160 128 Z" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1.5" />
              <circle cx="170" cy="123" r="2" fill="#0B0E14" />
              <circle cx="185" cy="121" r="2" fill="#0B0E14" />
              <circle cx="200" cy="120" r="2" fill="#0B0E14" />
              <circle cx="215" cy="121" r="2" fill="#0B0E14" />
              <circle cx="230" cy="123" r="2" fill="#0B0E14" />
              <polygon points="196,124 204,124 202,142 198,142" fill="url(#metalPlate)" stroke="#1E293B" stroke-width="1.5" />

              <path d="M 165 116 C 135 105 105 60 118 35 C 136 60 148 92 168 108 Z" fill="#F1F5F9" stroke="#475569" stroke-width="2" />
              <line x1="152" y1="95" x2="140" y2="85" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="142" y1="78" x2="130" y2="68" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="130" y1="60" x2="122" y2="52" stroke="#94A3B8" stroke-width="1.5" />

              <path d="M 235 116 C 265 105 295 60 282 35 C 264 60 252 92 232 108 Z" fill="#F1F5F9" stroke="#475569" stroke-width="2" />
              <line x1="248" y1="95" x2="260" y2="85" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="258" y1="78" x2="270" y2="68" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="270" y1="60" x2="278" y2="52" stroke="#94A3B8" stroke-width="1.5" />
            } @else if (state.selectedHat().type === 'wizard') {
              <path d="M 120 128 C 145 110 255 110 280 128 C 260 142 140 142 120 128 Z" fill="#1E1B4B" stroke="#4338CA" stroke-width="2" />
              <path d="M 152 122 Q 190 28 238 12 Q 212 65 248 122 Z" fill="#312E81" stroke="#5B54C4" stroke-width="2" />
              <path d="M 154 118 Q 200 110 246 118 L 244 126 Q 200 118 156 126 Z" fill="url(#goldTrim)" />
              <circle cx="200" cy="119" r="8" fill="#D3A343" stroke="#9A7521" stroke-width="1.5" />
              <circle cx="203" cy="119" r="6" fill="#312E81" />
              <polygon points="238,8 242,16 250,17 244,22 246,30 238,26 230,30 232,22 226,17 234,16" fill="#D3A343" filter="url(#softGlow)" />
            } @else if (state.selectedHat().type === 'visor') {
              <path d="M 156 118 Q 200 114 244 118 L 242 142 Q 200 148 158 142 Z" fill="#0B0E14" stroke="#4C8DFF" stroke-width="2.5" />
              <line x1="162" y1="130" x2="238" y2="130" stroke="#4C8DFF" stroke-width="3" filter="url(#softGlow)" />
              <polygon points="200,124 205,127 205,133 200,136 195,133 195,127" fill="none" stroke="#D3A343" stroke-width="1.5" />
              <rect x="152" y="122" width="8" height="18" rx="2" fill="#334155" stroke="#4C8DFF" stroke-width="1" />
              <rect x="240" y="122" width="8" height="18" rx="2" fill="#334155" stroke="#4C8DFF" stroke-width="1" />
            } @else if (state.selectedHat().type === 'crown') {
              <path d="M 158 126 L 162 88 L 178 110 L 200 75 L 222 110 L 238 88 L 242 126 Z" fill="url(#goldTrim)" stroke="#5E4612" stroke-width="2" />
              <polygon points="200,85 206,94 200,103 194,94" fill="#B24545" stroke="#FFFFFF" stroke-width="1" />
              <circle cx="166" cy="98" r="4" fill="#3F6FB5" stroke="#FFFFFF" stroke-width="0.8" />
              <circle cx="234" cy="98" r="4" fill="#3F6FB5" stroke="#FFFFFF" stroke-width="0.8" />
              <circle cx="180" cy="120" r="3" fill="#2FA08A" />
              <circle cx="200" cy="119" r="3.5" fill="#D3A343" />
              <circle cx="220" cy="120" r="3" fill="#2FA08A" />
            } @else {
              <path d="M 152 135 C 146 75 254 75 248 135 C 244 155 230 168 200 168 C 170 168 156 155 152 135 Z" fill="#18181B" stroke="#27272A" stroke-width="2" />
              <path d="M 166 138 Q 200 134 234 138 L 228 168 Q 200 172 172 168 Z" fill="#27272A" stroke="#2FA08A" stroke-width="1.5" />
              <path d="M 235 155 Q 275 140 305 160 Q 280 175 240 165 Z" fill="#2FA08A" opacity="0.85" />
            }
          </g>

          <!-- Weapon -->
          <g id="weapon" transform="translate(100, 270) rotate(-15)">
            @if (state.selectedWeapon().type === 'sword') {
              <circle cx="0" cy="35" r="7" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1.5" />
              <rect x="-4" y="0" width="8" height="35" rx="2" fill="#78350F" />
              <path d="M -26 -2 Q 0 -10 26 -2 L 20 8 Q 0 2 -20 8 Z" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1.5" />
              <circle cx="0" cy="2" r="5" fill="#B24545" />
              <path d="M -10 -6 L 0 -145 L 10 -6 Z" fill="#E06A2B" stroke="#E06A2B" stroke-width="2" filter="url(#softGlow)" />
              <path d="M -5 -6 L 0 -135 L 5 -6 Z" fill="#E8C05A" />
              <line x1="0" y1="-6" x2="0" y2="-125" stroke="#FFFFFF" stroke-width="2" />
            } @else if (state.selectedWeapon().type === 'staff') {
              <line x1="0" y1="65" x2="0" y2="-130" stroke="#2F6FA8" stroke-width="8" stroke-linecap="round" />
              <line x1="0" y1="60" x2="0" y2="-125" stroke="#6FA8DC" stroke-width="3" stroke-linecap="round" />
              <path d="M -16 -120 Q -24 -145 0 -168 Q 24 -145 16 -120" fill="none" stroke="url(#goldTrim)" stroke-width="3" />
              <polygon points="0,-182 18,-150 0,-118 -18,-150" fill="#6FA8DC" stroke="#FFFFFF" stroke-width="2" filter="url(#softGlow)" />
              <circle cx="0" cy="-150" r="5" fill="#FFFFFF" />
            } @else if (state.selectedWeapon().type === 'bow') {
              <rect x="-4" y="-18" width="8" height="36" rx="3" fill="#1C1917" stroke="url(#goldTrim)" stroke-width="1.5" />

              <path d="M 0 -18 Q -38 -65 -32 -115 Q -28 -125 -18 -130" fill="none" stroke="#D3A343" stroke-width="7" stroke-linecap="round" filter="url(#softGlow)" />
              <path d="M 0 -18 Q -38 -65 -32 -115 Q -28 -125 -18 -130" fill="none" stroke="#9A7521" stroke-width="3" stroke-linecap="round" />

              <path d="M 0 18 Q -38 65 -32 115 Q -28 125 -18 130" fill="none" stroke="#D3A343" stroke-width="7" stroke-linecap="round" filter="url(#softGlow)" />
              <path d="M 0 18 Q -38 65 -32 115 Q -28 125 -18 130" fill="none" stroke="#9A7521" stroke-width="3" stroke-linecap="round" />

              <line x1="-18" y1="-130" x2="-18" y2="130" stroke="#F0DFA0" stroke-width="2" stroke-dasharray="6 2" />

              <line x1="8" y1="0" x2="-90" y2="0" stroke="#4C8DFF" stroke-width="3.5" filter="url(#softGlow)" />
              <line x1="8" y1="0" x2="-90" y2="0" stroke="#FFFFFF" stroke-width="1.5" />
              <polygon points="-90,0 -76,-8 -80,0 -76,8" fill="#4C8DFF" stroke="#FFFFFF" stroke-width="1.5" filter="url(#softGlow)" />
              <polygon points="5,-6 8,0 5,6 0,0" fill="#D3A343" />
              <polygon points="-5,-6 -2,0 -5,6 -10,0" fill="#D3A343" />
            } @else if (state.selectedWeapon().type === 'scythe') {
              <path d="M 0 65 Q -6 -60 0 -150" stroke="#4C1D95" stroke-width="8" fill="none" stroke-linecap="round" />
              <path d="M 0 -140 Q -65 -175 -110 -130 Q -50 -120 0 -110 Z" fill="#8B7CF0" stroke="#A996EC" stroke-width="2.5" filter="url(#softGlow)" />
              <circle cx="-50" cy="-135" r="8" fill="#A996EC" filter="url(#softGlow)" />
            } @else if (state.selectedWeapon().type === 'daggers') {
              <rect x="-4" y="0" width="8" height="25" fill="#1F6A5C" rx="2" />
              <path d="M -7 0 L 0 -80 L 7 0 Z" fill="#2FA08A" stroke="#5CC3AC" stroke-width="2" filter="url(#softGlow)" />
              <path d="M 12 12 L 25 -55 L 22 12 Z" fill="#26856F" stroke="#5CC3AC" stroke-width="1.5" filter="url(#softGlow)" />
            } @else {
              <line x1="0" y1="35" x2="0" y2="-95" stroke="#9C3A66" stroke-width="6" stroke-linecap="round" />
              <circle cx="0" cy="-105" r="16" fill="#C9506F" stroke="#FFFFFF" stroke-width="2" filter="url(#softGlow)" />
              <circle cx="0" cy="-105" r="7" fill="#D3A343" />
            }
          </g>
        </svg>
      </div>

      <!-- Combat Power Footer -->
      <div class="combat-power-footer">
        <div class="combat-footer-header">
          <span class="combat-title">COMBAT POWER</span>
          <span class="synergy-status-badge" [class.synergy-glow]="state.weaponSynergy().active">
            {{ state.weaponSynergy().level }}
          </span>
        </div>

        <div class="power-value-row">
          <div class="main-power-box">
            <span class="power-number">{{ state.totalAttackPower() }}</span>
            <span class="power-label">TOTAL ATK</span>
          </div>

          <div class="power-breakdown-chips">
            <div class="chip-item">
              <span class="chip-k">DEF</span>
              <span class="chip-v">{{ state.defenseRating() }}</span>
            </div>
            <div class="chip-item">
              <span class="chip-k">CRIT</span>
              <span class="chip-v">{{ state.critChance() }}%</span>
            </div>
            <div class="chip-item">
              <span class="chip-k">MANA</span>
              <span class="chip-v">{{ state.manaPool() }}</span>
            </div>
          </div>
        </div>

        <div class="gauge-bar-track">
          <div
            class="gauge-bar-fill"
            [style.width.%]="Math.min(100, (state.totalAttackPower() / 160) * 100)"
          ></div>
        </div>

        <div class="footer-synergy-desc">
          {{ state.weaponSynergy().description }} ({{ state.weaponSynergy().bonus }})
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .canvas-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.15rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 0.75rem;
      position: relative;
      height: 100%;
    }

    .header-hud {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.3rem;
      background: var(--bg-base);
      padding: 0.9rem 1.25rem;
      border-radius: 0.6rem;
      border: 1px solid var(--border-subtle);
    }

    .archetype-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-code);
      font-size: 0.66rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: var(--bg-panel);
      border: 1px solid;
      padding: 0.18rem 0.6rem;
      border-radius: 9999px;
      letter-spacing: 0.08em;
    }

    .archetype-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .character-bold-title {
      font-family: var(--font-rpg);
      font-size: 1.55rem;
      font-weight: 700;
      letter-spacing: 0.07em;
      color: var(--text-primary);
      margin: 0.15rem 0 0 0;
      word-break: break-word;
    }

    .character-subtitle {
      font-size: 0.78rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin: 0;
    }

      .character-display-box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at 50% 58%, #1a2029 0%, var(--bg-base) 78%);
      border-radius: 0.65rem;
      border: 1px solid var(--border-subtle);
      min-height: 385px;
      cursor: pointer;
      overflow: hidden;
      user-select: none;
      transition: border-color 0.2s ease;
    }

    .character-display-box:hover {
      border-color: var(--border-strong);
    }

    .attack-action-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--bg-panel);
      border: 1px solid var(--border-subtle);
      border-radius: 0.4rem;
      padding: 0.32rem 0.85rem;
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 600;
      font-family: var(--font-code);
      cursor: pointer;
      z-index: 20;
      transition: all 0.18s ease;
    }

    .attack-action-btn:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: #0b1220;
    }

    .character-svg {
      width: 100%;
      max-width: 380px;
      height: 370px;
      transform-origin: center bottom;
    }

    .aura-spinner {
      animation: spin 16s linear infinite;
      transform-origin: 200px 220px;
    }

    .aura-spinner-reverse {
      animation: spinReverse 18s linear infinite;
      transform-origin: 200px 220px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes spinReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    .combat-power-footer {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 0.6rem;
      padding: 0.95rem 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      flex-shrink: 0;
    }

    .combat-footer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .combat-title {
      font-family: var(--font-rpg);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 0.1em;
    }

    .synergy-status-badge {
      font-family: var(--font-code);
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--bg-panel);
      padding: 0.18rem 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid var(--border-subtle);
    }

    .synergy-glow {
      color: var(--accent) !important;
      border-color: var(--accent-line) !important;
      background: var(--accent-soft) !important;
    }

    .power-value-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .main-power-box {
      display: flex;
      align-items: baseline;
      gap: 0.45rem;
    }

    .power-number {
      font-family: var(--font-code);
      font-size: 2.05rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .power-label {
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.06em;
    }

    .power-breakdown-chips {
      display: flex;
      gap: 0.4rem;
    }

    .chip-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--bg-panel);
      border: 1px solid var(--border-subtle);
      border-radius: 0.35rem;
      padding: 0.3rem 0.6rem;
      min-width: 54px;
    }

    .chip-k {
      font-family: var(--font-code);
      font-size: 0.58rem;
      color: var(--text-muted);
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .chip-v {
      font-family: var(--font-code);
      font-size: 0.82rem;
      color: var(--text-primary);
      font-weight: 700;
    }

    .gauge-bar-track {
      width: 100%;
      height: 6px;
      background: var(--bg-panel);
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }

    .gauge-bar-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 9999px;
      transition: width 0.35s ease;
    }

    .footer-synergy-desc {
      font-size: 0.7rem;
      color: var(--text-muted);
      line-height: 1.35;
    }
  `]
})
export class CharacterCanvasComponent {
  state = inject(CharacterStateService);
  Math = Math;
}