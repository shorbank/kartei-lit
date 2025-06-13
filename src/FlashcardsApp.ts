// src/FlashcardsApp.ts
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

    .card {
      background-color: #f4f4f4;
      color: #000;
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
      background-color: #d4edda;
      color: #155724;
      font-weight: bold;
    }

    @media (prefers-color-scheme: dark) {
      .card {
        background-color: #333;
        color: #fff;
        box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
      }

      .correct {
        background-color: #204d35;
        color: #b2f5cb;
      }
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

  async loadFlashcards() {
    try {
      const res = await fetch('https://fh-salzburg-3e27a-default-rtdb.europe-west1.firebasedatabase.app/flashcards.json');
      const data = await res.json();
      this.flashcards = Object.values(data);
    } catch (e) {
      console.error('Fehler beim Laden der Flashcards:', e);
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`<p>Lade Flashcards…</p>`;
    }

    return html`
      <h2>Kartei</h2>
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
