// src/FlashcardsApp.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('flashcards-app')
export class FlashcardsApp extends LitElement {
  static styles = css`
    /* einfache Styles */
    :host {
      display: block;
      padding: 1rem;
      font-family: sans-serif;
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
      // Falls das JSON ein Objekt ist, in ein Array umwandeln
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
      <ul>
        ${this.flashcards.map((card, index) => html`
          <li><strong>${index + 1}.</strong> ${card.question}</li>
        `)}
      </ul>
    `;
  }
}
