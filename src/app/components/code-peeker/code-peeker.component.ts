import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CharacterStateService } from '../../services/character-state.service';

/* ---------- tiny syntax highlighter (escape first, then colour tokens) ---------- */
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TS_TOKENS =
  /(?<comment>\/\/[^\n]*)|(?<str>'[^'\n]*')|(?<decl>\breadonly\s+\w+)|(?<call>\b(?:signal|computed|Math\.round)\b)|(?<kw>\b(?:readonly|const|let|return|if|this)\b)|(?<type>\b(?:string|boolean|number|RpgStats|HatItem|WeaponItem)\b)|(?<num>\b\d+(?:\.\d+)?\b)|(?<bool>\b(?:true|false)\b)/g;

const HTML_TOKENS =
  /(?<comment>&lt;!--[\s\S]*?--&gt;)|(?<str>"[^"\n]*")|(?<bind>\[\(?[\w.-]+\)?\]|\([\w.-]+\))(?==)|(?<attr>\b[\w-]+)(?==")|(?<ctl>@(?:else if|if|else|for)\b|\btrack\b)|(?<tag>&lt;\/?[\w-]+)|(?<interp>\{\{[^}\n]*\}\})/g;

const TS_STYLE: Record<string, string> = {
  comment: 'color:#6b7684',
  str: 'color:#8fc7b5',
  call: 'color:#6fa8dc',
  kw: 'color:#a996ec',
  type: 'color:#d3a343',
  num: 'color:#d98266',
  bool: 'color:#d9636f'
};

const HTML_STYLE: Record<string, string> = {
  comment: 'color:#6b7684',
  str: 'color:#8fc7b5',
  attr: 'color:#6fa8dc',
  ctl: 'color:#a996ec;font-weight:bold',
  tag: 'color:#d9636f',
  interp: 'color:#d3a343'
};

const HOT = 'background:rgba(211,163,67,0.18);color:#e0bd6c;padding:2px 4px;border-radius:4px';

function paint(code: string, lang: 'ts' | 'html', hotName = ''): string {
  const styles = lang === 'ts' ? TS_STYLE : HTML_STYLE;
  const re = lang === 'ts' ? TS_TOKENS : HTML_TOKENS;

  return esc(code).replace(re, (...args: unknown[]) => {
    const text = args[0] as string;
    const groups = args[args.length - 1] as Record<string, string | undefined>;
    const kind = Object.keys(groups).find((k) => groups[k] !== undefined) ?? '';

    if (kind === 'decl') {
      const m = /^(readonly)(\s+)(\w+)$/.exec(text);
      if (m) {
        const nameStyle = m[3] === hotName ? HOT : 'color:#6fa8dc';
        return `<span style="color:#a996ec">${m[1]}</span>${m[2]}<span style="${nameStyle}">${m[3]}</span>`;
      }
    }

    if (kind === 'bind') {
      const style = text.startsWith('[(')
        ? 'color:#d3a343;font-weight:bold'
        : text.startsWith('[')
          ? 'color:#6fa8dc;font-weight:bold'
          : 'color:#2fa08a;font-weight:bold';
      return `<span style="${style}">${text}</span>`;
    }

    return `<span style="${styles[kind] ?? ''}">${text}</span>`;
  });
}

@Component({
  selector: 'app-code-peeker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    @if (state.codePeekerOpen()) {
      <div class="drawer-backdrop" (click)="state.toggleCodePeeker()"></div>
    }

    <!-- Slide-over drawer -->
    <aside
      class="drawer-panel"
      [class.drawer-active]="state.codePeekerOpen()"
      [class.presenter-large]="state.presenterMode()"
      [attr.aria-hidden]="!state.codePeekerOpen()"
    >
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-badge">ANGULAR ARCHITECTURE</span>
          <h2 class="drawer-title">Live Code Peeker</h2>
        </div>

        <div class="drawer-actions">
          <div class="font-zoom-group" title="Adjust code font size">
            <button class="zoom-btn" (click)="adjustFontSize(-1)">A−</button>
            <button class="zoom-btn" (click)="adjustFontSize(1)">A+</button>
          </div>

          <button class="close-btn" (click)="state.toggleCodePeeker()" title="Close (Esc)" aria-label="Close code peeker">
            ✕
          </button>
        </div>
      </div>

      <div class="signal-alert-banner">
        <span class="alert-text">
          Last updated signal: <strong>{{ state.lastUpdatedSignal().name }}()</strong>
          &rarr; <em class="alert-value">{{ state.lastUpdatedSignal().value }}</em>
        </span>
      </div>

      <nav class="peeker-tabs">
        <button class="peeker-tab" [class.tab-active]="state.activeCodeTab() === 'signals'" (click)="state.setCodeTab('signals')">
          Signals &amp; Computed
        </button>
        <button class="peeker-tab" [class.tab-active]="state.activeCodeTab() === 'bindings'" (click)="state.setCodeTab('bindings')">
          Data Bindings
        </button>
        <button class="peeker-tab" [class.tab-active]="state.activeCodeTab() === 'directives'" (click)="state.setCodeTab('directives')">
          Control Flow
        </button>
        <button class="peeker-tab" [class.tab-active]="state.activeCodeTab() === 'state'" (click)="state.setCodeTab('state')">
          Live State Tree
        </button>
      </nav>

      @if (state.activeCodeTab() === 'signals') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">What are Angular Signals?</h4>
            <p class="concept-desc">
              Signals are reactive state primitives. Unlike plain variables, a signal notifies only the
              DOM nodes that read it, which removes the need for full-tree dirty checking.
            </p>
          </div>

          <div class="code-card">
            <div class="code-card-header">
              <span class="filename">character-state.service.ts</span>
              <button class="copy-btn" (click)="copy(signalsCode())">
                {{ copied() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="signalsHtml()"></code></pre>
          </div>

          <div class="concept-explanation">
            <h4 class="concept-title">What is computed()?</h4>
            <p class="concept-desc">
              <code>computed()</code> defines a memoized signal derived from other signals.
              <code>totalAttackPower()</code> is currently <strong>{{ state.totalAttackPower() }}</strong>,
              recalculated automatically whenever the weapon or stats change.
            </p>
          </div>
        </div>
      }

      @if (state.activeCodeTab() === 'bindings') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">Binding syntax at a glance</h4>
            <p class="concept-desc">
              <code>[ ]</code> pushes data from the component to the view, <code>( )</code> sends events
              back from the view, and <code>[( )]</code> combines both into two-way binding.
            </p>
          </div>

          <div class="code-card">
            <div class="code-card-header">
              <span class="filename">bindings-showcase.component.html</span>
              <button class="copy-btn" (click)="copy(bindingsCode())">
                {{ copied() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="bindingsHtml()"></code></pre>
          </div>
        </div>
      }

      @if (state.activeCodeTab() === 'directives') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">Modern control flow</h4>
            <p class="concept-desc">
              Angular 17+ replaced <code>*ngIf</code> and <code>*ngFor</code> with native template syntax.
              It needs no imports and requires <code>track</code> for efficient DOM reconciliation.
            </p>
          </div>

          <div class="code-card">
            <div class="code-card-header">
              <span class="filename">character-canvas.component.html</span>
              <button class="copy-btn" (click)="copy(controlFlowCode())">
                {{ copied() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="controlFlowHtml()"></code></pre>
          </div>
        </div>
      }

      @if (state.activeCodeTab() === 'state') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">In-memory reactive state</h4>
            <p class="concept-desc">Active signals and computed values, inspected in real time.</p>
          </div>

          <div class="code-card">
            <div class="code-card-header">
              <span class="filename">live-reactive-state.json</span>
              <button class="copy-btn" (click)="copy(stateJson())">
                {{ copied() ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code>{{ stateJson() }}</code></pre>
          </div>
        </div>
      }

      <div class="drawer-footer">
        <span class="footer-note">Angular standalone components and signals</span>
      </div>
    </aside>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 12, 0.6);
      backdrop-filter: blur(3px);
      z-index: 60;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 620px;
      max-width: 95vw;
      background: var(--bg-base);
      border-left: 1px solid var(--border-strong);
      box-shadow: -18px 0 40px rgba(0, 0, 0, 0.5);
      z-index: 70;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      visibility: hidden;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.3s;
    }

    .drawer-active {
      transform: translateX(0);
      visibility: visible;
      transition-delay: 0s;
    }

    .presenter-large {
      width: 740px;
      max-width: 98vw;
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.35rem;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }

    .drawer-badge {
      font-family: var(--font-code);
      font-size: 0.64rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.1em;
    }

    .drawer-title {
      font-family: var(--font-rpg);
      font-size: 1.2rem;
      color: var(--text-primary);
      margin: 0;
    }

    .drawer-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .font-zoom-group {
      display: flex;
      border: 1px solid var(--border-subtle);
      border-radius: 0.35rem;
      overflow: hidden;
    }

    .zoom-btn {
      background: var(--bg-elevated);
      color: var(--text-secondary);
      border: none;
      padding: 0.25rem 0.6rem;
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .zoom-btn:hover {
      background: var(--accent);
      color: #0b1220;
    }

    .close-btn {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      width: 31px;
      height: 31px;
      border-radius: 0.35rem;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s ease;
    }

    .close-btn:hover {
      background: var(--accent-rose);
      border-color: var(--accent-rose);
      color: #ffffff;
    }

    .signal-alert-banner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 1.35rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.75rem;
    }

    .alert-text {
      color: var(--text-secondary);
      font-family: var(--font-code);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-value {
      color: var(--accent);
      font-style: normal;
      font-weight: 600;
    }

    .peeker-tabs {
      display: flex;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      overflow-x: auto;
    }

    .peeker-tab {
      padding: 0.7rem 1rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.18s ease;
    }

    .peeker-tab:hover {
      color: var(--text-primary);
    }

    .tab-active {
      color: var(--accent) !important;
      border-bottom-color: var(--accent) !important;
    }

    .tab-scroll-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.15rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .concept-explanation {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 0.85rem;
    }

    .concept-title {
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .concept-desc {
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.55;
    }

    .concept-desc code {
      font-family: var(--font-code);
      color: var(--accent);
      background: var(--accent-soft);
      padding: 0.08rem 0.3rem;
      border-radius: 0.22rem;
    }

    .code-card {
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: 0.55rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .code-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0.8rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
    }

    .filename {
      font-family: var(--font-code);
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .copy-btn {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 0.18rem 0.55rem;
      border-radius: 0.25rem;
      font-size: 0.7rem;
      font-family: var(--font-code);
      cursor: pointer;
      transition: all 0.18s ease;
    }

    .copy-btn:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: #0b1220;
    }

    .code-block {
      padding: 1rem;
      margin: 0;
      font-family: var(--font-code);
      line-height: var(--code-line-height);
      color: var(--text-primary);
      overflow: auto;
      max-height: 380px;
      white-space: pre;
      background: var(--bg-input);
      scrollbar-width: thin;
    }

    .code-block code { font-family: inherit; }

    .presenter-large .code-block { max-height: 480px; }

    .drawer-footer {
      padding: 0.7rem 1.25rem;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      text-align: center;
    }

    .footer-note {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
  `]
})
export class CodePeekerComponent {
  state = inject(CharacterStateService);
  private sanitizer = inject(DomSanitizer);

  codeFontSize = signal<number>(14);
  copied = signal<boolean>(false);

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.state.codePeekerOpen()) this.state.toggleCodePeeker();
  }

  adjustFontSize(delta: number): void {
    this.codeFontSize.update((sz) => Math.max(12, Math.min(22, sz + delta)));
  }

  async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.copied.set(false);
    }
  }

  // Safe because paint() escapes all text (including the hero name) before adding <span>s.
  private trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  readonly signalsCode = computed(() => {
    const s = this.state;
    const b = s.attackBreakdown();
    const hat = s.selectedHat();
    const st = s.stats();
    const power = s.selectedPower();
    const p = b.primaryKey;
    const q = b.secondaryKey;

    return `// 1. Writable Signals (State)
readonly characterName = signal<string>('${s.characterName()}');
readonly selectedWeapon = signal<WeaponItem>({ name: '${s.selectedWeapon().name}', baseDamage: ${b.base} });
readonly selectedHat = signal<HatItem>({ name: '${hat.name}', strengthBonus: ${hat.strengthBonus}, agilityBonus: ${hat.agilityBonus}, magicBonus: ${hat.magicBonus} });
readonly powerActive = signal<boolean>(${s.powerActive()});
readonly stats = signal<RpgStats>({ strength: ${st.strength}, agility: ${st.agility}, magic: ${st.magic} });

// 2. Computed Signal (re-runs only when a signal it reads changes)
readonly totalAttackPower = computed(() => {
  let damage = this.selectedWeapon().baseDamage;                          // ${b.base}
  damage += (st.${p} + hat.${p}Bonus) * ${b.primaryMult};        // ${b.primaryTotal} * ${b.primaryMult} = ${b.primaryBonus.toFixed(1)}
  damage += (st.${q} + hat.${q}Bonus) * ${b.secondaryMult};      // ${b.secondaryTotal} * ${b.secondaryMult} = ${b.secondaryBonus.toFixed(1)}
  if (powerActive && power.element === weapon.element) damage += 18;      // ${b.synergy ? '+18 resonance ACTIVE' : 'no resonance'}
  if (powerActive) damage *= ${power.powerMultiplier};                            // x${b.multiplier}
  return Math.round(damage);                                              // => ${b.total}
});`;
  });

  readonly bindingsCode = computed(() => {
    const s = this.state;
    return `<!-- 1. TWO-WAY BINDING: [(ngModel)] -->
<input
  type="text"
  [(ngModel)]="characterName" />
<!-- Live in-memory value: "${s.characterName()}" -->

<!-- 2. PROPERTY BINDING: [style.fill] (component → DOM) -->
<path
  d="M 166 120 C 164 150 175 174 200 174 ..."
  [style.fill]="skinColor()" />
<!-- Evaluates to: "${s.skinColor()}" -->

<!-- 3. EVENT BINDING: (click) (DOM → component) -->
<button (click)="setWeapon(weapon)">
  Equip {{ weapon.name }}
</button>
<!-- Equipped right now: "${s.selectedWeapon().name}" -->

<!-- 4. CLASS BINDING: [class.name] -->
<button [class.card-active]="selectedWeapon().id === weapon.id">
<!-- card-active is currently on: ${s.selectedWeapon().id} -->`;
  });

  readonly controlFlowCode = computed(() => {
    const s = this.state;
    return `<!-- 1. CONTROL FLOW: @if adds / removes DOM nodes -->
@if (powerActive()) {
  <g class="power-aura-group">
    <circle r="145" fill="url(#${s.selectedPower().element}Glow)" />
  </g>
} @else {
  <span>Power Dormant</span>
}
<!-- powerActive() is ${s.powerActive()} → ${s.powerActive() ? 'aura is mounted' : 'aura is removed from the DOM'} -->

<!-- 2. CONTROL FLOW: @for loops, track is mandatory -->
@for (w of weapons; track w.id) {
  <button
    [class.card-active]="selectedWeapon().id === w.id"
    (click)="setWeapon(w)"
  >
    {{ w.symbolTag }} {{ w.name }}
  </button>
}`;
  });

  readonly stateJson = computed(() => {
    const s = this.state;
    return JSON.stringify(
      {
        characterName: s.characterName(),
        characterTitle: s.characterTitle(),
        selectedClass: s.selectedClass().name,
        skinColor: s.skinColor(),
        selectedHat: s.selectedHat().name,
        selectedOutfit: s.selectedOutfit().name,
        selectedWeapon: {
          name: s.selectedWeapon().name,
          element: s.selectedWeapon().element,
          baseDamage: s.selectedWeapon().baseDamage
        },
        powerActive: s.powerActive(),
        selectedPower: s.selectedPower().name,
        stats: s.stats(),
        availableStatPoints: s.availableStatPoints(),
        attackBreakdown: s.attackBreakdown(),
        defenseRating: s.defenseRating(),
        critChance: s.critChance() + '%',
        manaPool: s.manaPool() + ' MP',
        weaponSynergy: s.weaponSynergy()
      },
      null,
      2
    );
  });

  readonly signalsHtml = computed(() =>
    this.trust(paint(this.signalsCode(), 'ts', this.state.lastUpdatedSignal().name))
  );
  readonly bindingsHtml = computed(() => this.trust(paint(this.bindingsCode(), 'html')));
  readonly controlFlowHtml = computed(() => this.trust(paint(this.controlFlowCode(), 'html')));
}