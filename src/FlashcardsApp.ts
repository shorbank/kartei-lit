import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('flashcards-app')
export class FlashcardsApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: sans-serif;
      width: 100dvw;
      heigt: 100dvh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
    }

    h2 {
      margin: 0;
    }

    .settings-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
    }

    .settings-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .settings-btn svg {
      fill: var(--icon-color);
      transition: fill 0.3s;
    }

    .toggle-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
      font-size: 0.9rem;
      user-select: none;
    }

    .toggle-switch input {
      display: none;
    }

    .toggle-switch .slider {
      width: 40px;
      height: 20px;
      background-color: #ccc;
      border-radius: 20px;
      position: relative;
      transition: background-color 0.3s;
      cursor: pointer;
    }

    .toggle-switch .slider::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      height: 16px;
      width: 16px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }

    .toggle-switch input:checked + .slider {
      background-color: #4f46e5;
    }

    .toggle-switch input:checked + .slider::before {
      transform: translateX(20px);
    }

    .card {
      background-color: var(--card-bg);
      color: var(--card-text);
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .choice {
      margin: 0.25rem 0;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .correct {
      background-color: var(--correct-bg);
      color: var(--correct-text);
      font-weight: bold;
    }

    .wrong {
      background-color: #f8d7da;
      color: #721c24;
      font-weight: bold;
    }

    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      background-color: #4f46e5;
      color: white;
      cursor: pointer;
    }

    button:hover {
      background-color: #4338ca;
    }
  `;

  @state()
  private flashcards: {
    question: string;
    choices: string[];
    correctIndex: number;
  }[] = [];

  @state() private isLoading = true;
  @state() private showSettings = false;
  @state() private currentIndex = 0;
  @state() private selectedIndex: number | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadFlashcards();
  }

  firstUpdated() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  async loadFlashcards() {
    try {
      const res = await fetch('https://fh-salzburg-3e27a-default-rtdb.europe-west1.firebasedatabase.app/flashcards.json');
      const data = await res.json();
      this.flashcards = data ? Object.values(data) : [];
    } catch (e) {
      console.error('Fehler beim Laden der Flashcards:', e);
    } finally {
      this.isLoading = false;
    }
  }

  toggleTheme(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const theme = checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.requestUpdate();
  }

  isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  handleAnswer(index: number) {
    if (this.selectedIndex !== null) return;
    this.selectedIndex = index;
  }

  nextCard() {
    this.currentIndex++;
    this.selectedIndex = null;
  }

  render() {
    if (this.isLoading) {
      return html`<p>Lade Flashcards…</p>`;
    }

    return html`
      <div class="header">
        <h2>Kartei</h2>
        <button @click=${this.toggleSettings} class="settings-btn" aria-label="Einstellungen">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <path d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/>
          </svg>
        </button>
      </div>

      ${this.showSettings ? html`
        <div class="card">
          <p><strong>Settings:</strong></p>
          <label class="toggle-switch">
            <input type="checkbox" @change=${this.toggleTheme} ?checked=${this.isDarkMode()} />
            <span class="slider"></span>
            <span>Dark Mode</span>
          </label>
        </div>
      ` : null}

      ${this.flashcards.length > 0 && this.currentIndex < this.flashcards.length ? (() => {
        const card = this.flashcards[this.currentIndex];
        return html`
          <div class="card">
            <p><strong>Question ${this.currentIndex + 1}:</strong> ${card.question}</p>
            <ul>
              ${card.choices.map((choice, i) => {
                const isSelected = this.selectedIndex === i;
                const isCorrect = i === card.correctIndex;
                const isAnswered = this.selectedIndex !== null;

                return html`
                  <li
                    class="choice ${isAnswered && isCorrect ? 'correct' : ''} ${isAnswered && isSelected && !isCorrect ? 'wrong' : ''}"
                    @click=${() => this.handleAnswer(i)}
                  >
                    ${choice}
                  </li>
                `;
              })}
            </ul>

            ${this.selectedIndex !== null && this.currentIndex < this.flashcards.length - 1
              ? html`<button @click=${this.nextCard}>Next</button>`
              : this.selectedIndex !== null
              ? html`<p><strong>Finished! -- nice</strong></p>`
              : null}
          </div>
        `;
      })() : html`<p>Keine weiteren Fragen.</p>`}
    `;
  }
}
