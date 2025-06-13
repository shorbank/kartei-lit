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
      background: #f4f4f4;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      aspect-ratio: 16/9;
    }
  `;

  @state()
  private flashcards: any[] = [];

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
      <h2>Flashcards</h2>
      ${this.flashcards.map((card, index) => html`
        <div class="card">
          <p><strong>Frage ${index + 1}:</strong> ${card.question}</p>
        </div>
      `)}
    `;
  }
}
