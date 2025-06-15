import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('flashcards-app')
export class FlashcardsApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: sans-serif;
    }

    h2 {
      margin-bottom: 1rem;
    }

    .toggle-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
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
    }

    .correct {
      background-color: var(--correct-bg);
      color: var(--correct-text);
      font-weight: bold;
    }
  `;

  @state()
  private flashcards: {
    question: string;
    choices: string[];
    correctIndex: number;
  }[] = [];

  @state()
  private isLoading = true;

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
  }

  isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  render() {
    if (this.isLoading) {
      return html`<p>Lade Flashcards…</p>`;
    }

    return html`
      <h2>Kartei</h2>

      <label class="toggle-switch">
        <input type="checkbox" @change=${this.toggleTheme} ?checked=${this.isDarkMode()} />
        <span class="slider"></span>
        <span>Dark Mode</span>
      </label>

      ${this.flashcards.map((card, index) => html`
        <div class="card">
          <p><strong>Question ${index + 1}:</strong> ${card.question}</p>
          <ul>
            ${card.choices.map((choice, i) => html`
              <li class="choice ${i === card.correctIndex ? 'correct' : ''}">
                ${choice}
              </li>
            `)}
          </ul>
        </div>
      `)}
    `;
  }
}
