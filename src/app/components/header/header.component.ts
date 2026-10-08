import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterStateService } from '../../services/character-state.service';
import { PRESETS, CharacterPreset } from '../../models/character.model';
import { SoundEffectsService } from '../../services/sound-effects.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-container">
      <div class="brand-section">
        <div class="brand-text-col">
          <div class="title-row">
            <h1 class="brand-title">HERO FORGE</h1>
            <span class="signals-badge">ANGULAR SIGNALS</span>
          </div>
          <p class="brand-subtitle">
            2D Character Customizer &amp; Reactive State Inspector
          </p>
        </div>
      </div>

      <!-- Quick Presets -->
      <div class="presets-section">
        <span class="presets-label">PRESETS</span>
        <div class="segmented-bar">
          @for (preset of presets; track preset.name) {
            <button
              class="segmented-btn"
              [class.segmented-active]="state.characterName() === preset.name"
              (click)="onSelectPreset(preset)"
              [title]="'Load profile: ' + preset.name"
            >
              {{ preset.name.split(' ')[0] }}
            </button>
          }
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <button
          class="icon-btn"
          (click)="toggleSound()"
          [title]="sound.isEnabled ? 'Mute audio effects' : 'Enable audio effects'"
          aria-label="Toggle audio"
        >
          @if (sound.isEnabled) {
            <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          } @else {
            <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          }
        </button>

        <button
          class="presenter-switch-box"
          (click)="state.togglePresenterMode()"
          title="Toggle presenter (high contrast) mode"
        >
          <span class="presenter-label">Presenter</span>
          <span class="presenter-state-badge" [class.state-on]="state.presenterMode()">
            {{ state.presenterMode() ? 'ON' : 'OFF' }}
          </span>
        </button>

        <!-- THE ONLY ENTRY POINT TO THE CODE PEEKER -->
        <button class="cta-see-code-btn" (click)="state.toggleCodePeeker()">
          <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <span>Inspect Code</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1.5rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .brand-text-col {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .brand-title {
      font-family: var(--font-rpg);
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 0.07em;
      color: var(--text-primary);
      margin: 0;
    }

    .signals-badge {
      font-family: var(--font-code);
      font-size: 0.62rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      padding: 0.18rem 0.5rem;
      border-radius: 0.25rem;
      letter-spacing: 0.08em;
    }

    .brand-subtitle {
      font-size: 0.74rem;
      color: var(--text-muted);
      margin: 0;
    }

    .presets-section {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: var(--bg-base);
      padding: 0.3rem 0.55rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-subtle);
    }

    .presets-label {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-family: var(--font-code);
    }

    .segmented-bar {
      display: flex;
      gap: 0.2rem;
    }

    .segmented-btn {
      font-size: 0.76rem;
      font-weight: 500;
      padding: 0.32rem 0.7rem;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid transparent;
      border-radius: 0.35rem;
      cursor: pointer;
      transition: all 0.18s ease;
    }

    .segmented-btn:hover {
      color: var(--text-primary);
      background: var(--bg-elevated);
    }

    .segmented-active {
      background: var(--accent-soft) !important;
      color: var(--accent) !important;
      border-color: var(--accent-line) !important;
    }

    .controls-section {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .icon-btn {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      width: 36px;
      height: 36px;
      border-radius: 0.45rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s ease;
    }

    .icon-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-primary);
    }

    .icon-svg {
      width: 17px;
      height: 17px;
    }

    .presenter-switch-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      padding: 0.38rem 0.7rem;
      border-radius: 0.45rem;
      cursor: pointer;
      font: inherit;
      transition: border-color 0.18s ease;
    }

    .presenter-switch-box:hover {
      border-color: var(--border-strong);
    }

    .presenter-label {
      font-size: 0.76rem;
      color: var(--text-secondary);
    }

    .presenter-state-badge {
      font-family: var(--font-code);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.12rem 0.4rem;
      border-radius: 0.25rem;
      background: var(--bg-elevated);
      color: var(--text-muted);
    }

    .state-on {
      background: var(--accent-soft) !important;
      color: var(--accent) !important;
    }

    .cta-see-code-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--accent);
      border: 1px solid var(--accent);
      border-radius: 0.45rem;
      color: #0b1220;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.18s ease;
    }

    .cta-see-code-btn:hover {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
    }

    @media (max-width: 1080px) {
      .presets-section { display: none; }
    }
  `]
})
export class HeaderComponent {
  state = inject(CharacterStateService);
  sound = inject(SoundEffectsService);
  presets = PRESETS;

  onSelectPreset(preset: CharacterPreset): void {
    this.state.loadPreset(preset);
  }

  toggleSound(): void {
    this.sound.toggleSound();
  }
}