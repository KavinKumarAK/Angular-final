import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CharacterStateService } from '../../services/character-state.service';
import {
  CLASSES,
  HATS,
  OUTFITS,
  WEAPONS,
  SPECIAL_POWERS,
  SKIN_PALETTES,
} from '../../models/character.model';

@Component({
  selector: 'app-customizer-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="customizer-container card-glass">
      <!-- Section 1 - Hero Identity -->
      <div class="panel-section">
        <div class="section-title-row">
          <h3 class="section-title">HERO IDENTITY</h3>
          <span class="section-subtext">01</span>
        </div>

        <input
          type="text"
          class="hero-name-input"
          [(ngModel)]="heroName"
          placeholder="Enter hero name..."
          maxlength="24"
        />
      </div>

      <!-- Section 2 - Class & Palette -->
      <div class="panel-section">
        <div class="section-title-row">
          <h3 class="section-title">CLASS &amp; PALETTE</h3>
          <span class="section-subtext">02</span>
        </div>

        <div class="class-grid">
          @for (cls of classes; track cls.id) {
            <button
              class="class-option-card card-glass-interactive"
              [class.card-active]="state.selectedClass().id === cls.id"
              (click)="state.setClass(cls)"
            >
              <div class="class-card-top">
                <svg class="class-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" [innerHTML]="cls.icon"></svg>
                <span class="class-primary-tag">{{ cls.primaryStat.toUpperCase() }}</span>
              </div>
              <div class="class-label-wrap">
                <span class="class-label-name">{{ cls.name }}</span>
                <span class="class-label-sub">{{ cls.tagline }}</span>
              </div>
            </button>
          }
        </div>

        <div class="skin-tone-container">
          <span class="tone-label">Skin tone</span>
          <div class="swatches-wrap">
            @for (swatch of skinPalettes; track swatch.label) {
              <button
                class="tone-swatch"
                [style.backgroundColor]="swatch.value"
                [class.swatch-selected]="state.skinColor() === swatch.value"
                (click)="state.setSkinColor(swatch.value)"
                [title]="swatch.label"
              ></button>
            }
            <label class="native-picker-btn" title="Custom hex color">
              <input
                type="color"
                class="hidden-color-input"
                [value]="state.skinColor()"
                (input)="onColorInput($event)"
              />
              <svg class="picker-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25c0-.585.132-1.139.367-1.636l10.58-10.58a2.25 2.25 0 013.182 0l2.122 2.121a2.25 2.25 0 010 3.182l-10.58 10.58c-.497.235-1.05.367-1.636.367z" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 3 - Gear & Armor -->
      <div class="panel-section">
        <div class="section-title-row">
          <h3 class="section-title">GEAR &amp; ARMOR</h3>
          <span class="section-subtext">03</span>
        </div>

        <div class="gear-option-block">
          <label class="gear-block-label">HEADGEAR</label>
          <div class="headgear-chips-grid">
            @for (hat of displayedHats; track hat.id) {
              <button
                class="hat-chip-btn"
                [class.chip-selected]="state.selectedHat().id === hat.id"
                (click)="state.setHat(hat)"
              >
                <span class="chip-hat-name">{{ hat.name }}</span>
                <span class="rarity-badge" [class]="'badge-' + hat.rarity">
                  {{ hat.rarity }}
                </span>
              </button>
            }
          </div>
        </div>

        <div class="gear-option-block mt-3">
          <label class="gear-block-label">BODY OUTFIT</label>
          <div class="outfit-radio-pills">
            @for (outfit of displayedOutfits; track outfit.id) {
              <button
                class="radio-pill-btn"
                [class.pill-selected]="state.selectedOutfit().id === outfit.id"
                (click)="state.setOutfit(outfit)"
              >
                <span class="radio-indicator"></span>
                <span class="outfit-pill-name">{{ outfit.name }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Section 4 - Weapon Arsenal -->
      <div class="panel-section">
        <div class="section-title-row">
          <h3 class="section-title">WEAPON ARSENAL</h3>
          <span class="section-subtext">04</span>
        </div>

        <div class="weapons-grid">
          @for (weapon of weapons; track weapon.id) {
            <button
              class="weapon-card card-glass-interactive"
              [class.card-active]="state.selectedWeapon().id === weapon.id"
              (click)="state.setWeapon(weapon)"
            >
              <div class="weapon-top-row">
                <span class="weapon-sym">{{ weapon.symbolTag }}</span>
                <span class="weapon-dmg">{{ weapon.baseDamage }} DMG</span>
              </div>
              <div class="weapon-title">{{ weapon.name }}</div>
              <div class="weapon-bottom-tags">
                <span class="scaling-tag">Scales: {{ weapon.scalingStat.toUpperCase() }}</span>
                <span class="element-tag" [class]="'elem-' + weapon.element">
                  {{ weapon.element }}
                </span>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Section 5 - Special Power & Stats -->
      <div class="panel-section last-section">
        <div class="section-title-row">
          <h3 class="section-title">SPECIAL POWER &amp; STATS</h3>
          <span class="section-subtext">05</span>
        </div>

        <div class="power-toggle-strip">
          <div class="power-text-wrap">
            <span class="power-heading">Unleash elemental aura</span>
            <span class="power-subheading">Adds animated particles and a combat power multiplier</span>
          </div>
          <button
            class="switch-control"
            [class.switch-active]="state.powerActive()"
            (click)="state.togglePower()"
            aria-label="Toggle elemental aura"
          >
            <span class="switch-ball"></span>
          </button>
        </div>

        <div class="stat-pool-header">
          <span class="stat-pool-title">STAT POINTS</span>
          <span class="pool-points-badge">Remaining: <strong>{{ state.availableStatPoints() }}</strong></span>
        </div>

        <div class="stats-stepper-list">
          <div class="stepper-row">
            <span class="stat-lbl text-flame">STRENGTH</span>
            <div class="stepper-btns">
              <button class="step-btn" (click)="state.decreaseStat('strength')" [disabled]="state.stats().strength <= 2">−</button>
              <span class="step-val">{{ state.stats().strength }}</span>
              <button class="step-btn" (click)="state.increaseStat('strength')" [disabled]="state.availableStatPoints() <= 0">+</button>
            </div>
          </div>

          <div class="stepper-row">
            <span class="stat-lbl text-emerald">AGILITY</span>
            <div class="stepper-btns">
              <button class="step-btn" (click)="state.decreaseStat('agility')" [disabled]="state.stats().agility <= 2">−</button>
              <span class="step-val">{{ state.stats().agility }}</span>
              <button class="step-btn" (click)="state.increaseStat('agility')" [disabled]="state.availableStatPoints() <= 0">+</button>
            </div>
          </div>

          <div class="stepper-row">
            <span class="stat-lbl text-purple">MAGIC</span>
            <div class="stepper-btns">
              <button class="step-btn" (click)="state.decreaseStat('magic')" [disabled]="state.stats().magic <= 2">−</button>
              <span class="step-val">{{ state.stats().magic }}</span>
              <button class="step-btn" (click)="state.increaseStat('magic')" [disabled]="state.availableStatPoints() <= 0">+</button>
            </div>
          </div>
        </div>

        <div class="formula-box">
          <div class="formula-header-title">ATTACK POWER BREAKDOWN</div>
          <pre class="formula-pre"><code>{{ getFormulaText() }}</code></pre>
          <div class="formula-actions">
            <button class="reset-btn" (click)="state.resetStats()">Reset points</button>
          </div>
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

    .customizer-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.15rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 0.75rem;
      /* matches the right column's height exactly; scrolls inside if content is taller */
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
    }
    .panel-section {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 0.6rem;
      padding: 1rem;
      flex-shrink: 0;
    }

    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
      padding-bottom: 0.6rem;
      margin-bottom: 0.85rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .section-title {
      font-family: var(--font-rpg);
      font-size: 0.84rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 0.1em;
      margin: 0;
    }

    .section-subtext {
      font-size: 0.68rem;
      color: var(--text-muted);
      font-family: var(--font-code);
    }

    .hero-name-input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: 0.45rem;
      padding: 0.65rem 0.9rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      font-family: var(--font-ui);
      outline: none;
      transition: border-color 0.18s ease;
    }

    .hero-name-input::placeholder { color: var(--text-muted); }
    .hero-name-input:focus { border-color: var(--accent); }

    .class-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }

    .class-option-card {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.65rem 0.8rem;
      text-align: left;
    }

    .class-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .class-svg {
      width: 19px;
      height: 19px;
      stroke: var(--accent);
    }

    .class-primary-tag {
      font-family: var(--font-code);
      font-size: 0.58rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.06em;
    }

    .class-label-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
      display: block;
    }

    .class-label-sub {
      font-size: 0.66rem;
      color: var(--text-muted);
      display: block;
      line-height: 1.3;
    }

    .skin-tone-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-panel);
      padding: 0.6rem 0.8rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-subtle);
    }

    .tone-label {
      font-size: 0.73rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .swatches-wrap {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: wrap;
    }

    .tone-swatch {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: transform 0.18s ease, border-color 0.18s ease;
    }

    .tone-swatch:hover { transform: scale(1.12); }

    .swatch-selected {
      border-color: var(--accent) !important;
      transform: scale(1.12);
    }

    .native-picker-btn {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 50%;
    }

    .hidden-color-input {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .picker-svg {
      width: 12px;
      height: 12px;
      stroke: var(--text-secondary);
    }

    .gear-option-block {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .gear-block-label {
      font-family: var(--font-code);
      font-size: 0.64rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.1em;
    }

    .headgear-chips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.45rem;
    }

    .hat-chip-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.6rem;
      background: var(--bg-panel);
      border: 1px solid var(--border-subtle);
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: left;
    }

    .hat-chip-btn:hover {
      border-color: var(--border-strong);
      background: var(--bg-elevated);
    }

    .chip-selected {
      background: var(--accent-soft) !important;
      border-color: var(--accent-line) !important;
    }

    .chip-hat-name {
      font-size: 0.73rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .rarity-badge {
      font-family: var(--font-code);
      font-size: 0.58rem;
      font-weight: 600;
      padding: 0.08rem 0.32rem;
      border-radius: 0.2rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .badge-rare { color: #6fa8dc; background: rgba(111, 168, 220, 0.1); }
    .badge-epic { color: #a996ec; background: rgba(169, 150, 236, 0.1); }
    .badge-legendary { color: #c9a227; background: rgba(201, 162, 39, 0.1); }

    .outfit-radio-pills {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .radio-pill-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.8rem;
      background: var(--bg-panel);
      border: 1px solid var(--border-subtle);
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: left;
    }

    .radio-pill-btn:hover {
      border-color: var(--border-strong);
      background: var(--bg-elevated);
    }

    .pill-selected {
      background: var(--accent-soft) !important;
      border-color: var(--accent-line) !important;
    }

    .radio-indicator {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      border: 2px solid var(--text-muted);
      display: inline-block;
      transition: all 0.18s ease;
    }

    .pill-selected .radio-indicator {
      border-color: var(--accent);
      background: var(--accent);
    }

    .outfit-pill-name {
      font-size: 0.76rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .weapons-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .weapon-card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.65rem;
      text-align: left;
    }

    .weapon-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .weapon-sym {
      font-family: var(--font-code);
      font-size: 0.6rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.04em;
    }

    .weapon-dmg {
      font-family: var(--font-code);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .weapon-title {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .weapon-bottom-tags {
      display: flex;
      justify-content: space-between;
      font-size: 0.62rem;
      font-family: var(--font-code);
    }

    .scaling-tag { color: var(--text-muted); }

    .elem-flame { color: #d98246; }
    .elem-frost { color: #6fa8dc; }
    .elem-lightning { color: #c9a227; }
    .elem-void { color: #a996ec; }

    .power-toggle-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-panel);
      padding: 0.65rem 0.8rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-subtle);
      margin-bottom: 0.85rem;
    }

    .power-heading {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-primary);
      display: block;
    }

    .power-subheading {
      font-size: 0.66rem;
      color: var(--text-muted);
      display: block;
    }

    .switch-control {
      width: 44px;
      height: 23px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-strong);
      border-radius: 9999px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
      flex-shrink: 0;
    }

    .switch-ball {
      width: 15px;
      height: 15px;
      background: var(--text-muted);
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 4px;
      transition: transform 0.22s ease, background-color 0.22s ease;
    }

    .switch-active {
      background: var(--accent);
      border-color: var(--accent);
    }

    .switch-active .switch-ball {
      transform: translateX(21px);
      background: #0b1220;
    }

    .stat-pool-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .stat-pool-title {
      font-family: var(--font-code);
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .pool-points-badge {
      font-family: var(--font-code);
      font-size: 0.7rem;
      color: var(--text-secondary);
    }

    .pool-points-badge strong { color: var(--accent); }

    .stats-stepper-list {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin-bottom: 0.85rem;
    }

    .stepper-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-panel);
      padding: 0.5rem 0.75rem;
      border-radius: 0.45rem;
      border: 1px solid var(--border-subtle);
    }

    .stat-lbl {
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .text-flame { color: #d98246; }
    .text-emerald { color: #2fa08a; }
    .text-purple { color: #a996ec; }

    .stepper-btns {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .step-btn {
      width: 25px;
      height: 25px;
      border-radius: 0.3rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .step-btn:hover:not(:disabled) {
      background: var(--accent);
      border-color: var(--accent);
      color: #0b1220;
    }

    .step-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .step-val {
      font-family: var(--font-code);
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      min-width: 22px;
      text-align: center;
    }

    .formula-box {
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 0.75rem;
    }

    .formula-header-title {
      font-family: var(--font-code);
      font-size: 0.64rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      margin-bottom: 0.45rem;
    }

    .formula-pre {
      font-family: var(--font-code);
      font-size: 0.7rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
    }

    .formula-pre code { font-family: inherit; }

    .formula-actions {
      margin-top: 0.6rem;
      display: flex;
      justify-content: flex-end;
    }

    .reset-btn {
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 0.22rem 0.6rem;
      border-radius: 0.3rem;
      font-size: 0.68rem;
      font-family: var(--font-code);
      cursor: pointer;
      transition: all 0.18s ease;
    }

    .reset-btn:hover {
      border-color: var(--accent-rose);
      color: var(--accent-rose);
    }

    .mt-3 { margin-top: 0.85rem; }
  `]
})
export class CustomizerPanelComponent {
  state = inject(CharacterStateService);
  private sanitizer = inject(DomSanitizer);

  // The icon paths are our own constants, so it's safe to trust them.
  classes = CLASSES.map((c) => ({
    ...c,
    icon: this.sanitizer.bypassSecurityTrustHtml(c.iconSvg)
  }));

  displayedHats = HATS.filter(h => ['horned-helm', 'wizard-hat', 'cyber-visor', 'hero-crown'].includes(h.id));
  displayedOutfits = OUTFITS.filter(o => ['plate-armor', 'archmage-robe', 'cyber-exosuit'].includes(o.id));
  weapons = WEAPONS;
  specialPowers = SPECIAL_POWERS;
  skinPalettes = SKIN_PALETTES;

  get heroName(): string {
    return this.state.characterName();
  }
  set heroName(val: string) {
    this.state.setName(val);
  }

  onColorInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input) {
      this.state.setSkinColor(input.value);
    }
  }

  getFormulaText(): string {
    const b = this.state.attackBreakdown();
    return `base            = ${b.base}
${b.primaryKey} bonus = ${b.primaryTotal} × ${b.primaryMult} = ${b.primaryBonus.toFixed(1)}
${b.secondaryKey} bonus = ${b.secondaryTotal} × ${b.secondaryMult} = ${b.secondaryBonus.toFixed(1)}
synergy         = +${b.synergy}
aura multiplier = ×${b.multiplier}
result          = ${b.total} ATK`;
  }
}