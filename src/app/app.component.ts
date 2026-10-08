import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CharacterCanvasComponent } from './components/character-canvas/character-canvas.component';
import { CustomizerPanelComponent } from './components/customizer-panel/customizer-panel.component';
import { CodePeekerComponent } from './components/code-peeker/code-peeker.component';
import { CharacterStateService } from './services/character-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, CharacterCanvasComponent, CustomizerPanelComponent, CodePeekerComponent],
  template: `
    <div class="app-viewport" [class.presenter-mode]="state.presenterMode()">
      <app-header />

      <main class="main-content">
        <!-- LEFT: selection boxes -->
        <section class="stage-column" aria-label="Customization Panel">
          <app-customizer-panel />
        </section>

        <!-- RIGHT: hero -->
        <section class="stage-column" aria-label="Character Canvas">
          <app-character-canvas />
        </section>
      </main>

      <footer class="app-footer">
        <span>Angular Standalone Components &amp; Signals</span>
        <span>Hero Forge — Reactive State Demo</span>
      </footer>

      <!-- Drawer lives at the root so position:fixed works -->
      <app-code-peeker />
    </div>
  `,
  styles: [`
    .app-viewport {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .main-content {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1.12fr;
      gap: 1.5rem;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      padding: 1.5rem;
      /* stretch makes both columns the height of the taller one */
      align-items: stretch;
    }

    /* Each column becomes a flex container so its child fills the height */
    .stage-column {
      width: 100%;
      min-width: 0;
      display: flex;
    }

    .stage-column > * {
      flex: 1;
      min-width: 0;
    }

    .app-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      padding: 1rem 1.5rem 1.5rem 1.5rem;
      border-top: 1px solid var(--border-subtle);
      font-family: var(--font-code);
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    @media (max-width: 1080px) {
      .main-content { grid-template-columns: 1fr; }
      .stage-column:last-child { order: -1; }
    }

    @media (max-width: 640px) {
      .main-content { padding: 0.85rem; }
      .app-footer { flex-direction: column; text-align: center; }
    }
  `]
})
export class AppComponent {
  state = inject(CharacterStateService);
}