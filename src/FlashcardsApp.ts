import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { Flashcard } from "./types";
import { fetchFlashcards } from "./api";
import { flashcardsAppStyles } from "./FlashcardsApp.styles";

@customElement("flashcards-app")
export class FlashcardsApp extends LitElement {
  static styles = flashcardsAppStyles;

  @state() private flashcards: Flashcard[] = [];
  @state() private isLoading = true;
  @state() private showSettings = false;
  @state() private currentCardIndex = 0;
  @state() private showResults = false;

  connectedCallback() {
    super.connectedCallback();
    this.loadFlashcards();
  }

  firstUpdated() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }

  async loadFlashcards() {
    try {
      this.flashcards = await fetchFlashcards();
    } catch (e) {
      console.error("Error when loading the flashcards:", e);
    } finally {
      this.isLoading = false;
    }
  }

  toggleTheme(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const theme = checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  isDarkMode() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  handleAnswer(cardIndex: number, choiceIndex: number) {
    const updatedCard = {
      ...this.flashcards[cardIndex],
      userAnswer: choiceIndex,
    };
    this.flashcards = [
      ...this.flashcards.slice(0, cardIndex),
      updatedCard,
      ...this.flashcards.slice(cardIndex + 1),
    ];
  }

  postponeCard(cardIndex: number) {
    const postponedCard = {
      ...this.flashcards[cardIndex],
      postponed: true,
    };
    this.flashcards = [
      ...this.flashcards.slice(0, cardIndex),
      ...this.flashcards.slice(cardIndex + 1),
      postponedCard,
    ];
    this.requestUpdate();
  }

  nextCard() {
    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.currentCardIndex++;
    } else {
      this.currentCardIndex = this.flashcards.length;
    }
  }

  showEvaluation() {
    this.showResults = true;
  }

  render() {
    if (this.isLoading) {
      return html`<p>Lade Flashcards…</p>`;
    }

    const progressPercent =
      this.flashcards.length > 0
        ? Math.min(
            ((this.currentCardIndex + 1) / this.flashcards.length) * 100,
            100
          )
        : 0;

    return html`
      <div class="header">
        <div class="logo">
          <img class="kartei-logo" src="/kartei-logo.webp" alt="Kartei Logo" />
          <h2>Kartei</h2>
        </div>
        <button
          @click=${this.toggleSettings}
          class="settings-btn"
          aria-label="Einstellungen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
          >
            <path
              d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
            />
          </svg>
        </button>
      </div>

      ${this.showSettings
        ? html`
            <div class="modal-backdrop" @click=${this.toggleSettings}>
              <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
                <button class="close-btn" @click=${this.toggleSettings}>
                  ×
                </button>
                <h3>Settings</h3>
                <label class="toggle-switch">
                  <input
                    type="checkbox"
                    @change=${this.toggleTheme}
                    ?checked=${this.isDarkMode()}
                  />
                  <span class="slider"></span>
                  <span>Dark Mode</span>
                </label>
              </div>
            </div>
          `
        : null}

      <div class="card-stack">
        ${this.flashcards.map((card, cardIndex) => {
          const selected = card.userAnswer;
          const isVisible = cardIndex >= this.currentCardIndex;
          const zIndex = this.flashcards.length - cardIndex;

          return html`
            <div
              class="card ${cardIndex !== this.currentCardIndex
                ? "blurred"
                : ""} ${card.postponed ? "postponed" : ""}"
              style="
                --z: ${(cardIndex - this.currentCardIndex) * -1000}px;
                z-index: ${zIndex};
                opacity: ${isVisible ? 1 : 0};
                pointer-events: ${isVisible ? "auto" : "none"};
              "
            >
              <p class="question">
                <strong>Question ${card.id}:</strong> ${card.question}
              </p>
              <div class="choices">
                ${card.choices.map((choice, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === card.correctIndex;
                  const isAnswered = selected !== null;

                  let className = "choice-btn";
                  if (isAnswered && isCorrect) className += " correct";
                  else if (isAnswered && isSelected) className += " wrong";

                  return html`
                    <button
                      class="${className}"
                      ?disabled=${isAnswered}
                      @click=${() => this.handleAnswer(cardIndex, i)}
                    >
                      <strong>${String.fromCharCode(97 + i)}.</strong> ${choice}
                    </button>
                  `;
                })}
              </div>

              ${selected !== null && cardIndex === this.currentCardIndex
                ? html`<button class="action-btn" @click=${this.nextCard}>
                    Next Question
                  </button>`
                : null}
              ${selected === null && cardIndex === this.currentCardIndex
                ? html`<button
                    class="action-btn"
                    @click=${() => this.postponeCard(cardIndex)}
                  >
                    Skip Question
                  </button>`
                : null}
            </div>
          `;
        })}
        ${this.currentCardIndex >= this.flashcards.length
          ? html`
              <div class="card final" style="--z: 0; z-index: 999;">
                <h2>All questions answered</h2>
                <p>Well done! If you want to see the correct answers to the questions asked, click on the corresponding question below the evaluation.</p> 
                <p>You can reload the page to restart.</p>

                ${!this.showResults
                  ? html`<button @click=${this.showEvaluation}>
                      Show evaluation
                    </button>`
                  : (() => {
                      const correctCount = this.flashcards.filter(
                        (card) => card.userAnswer === card.correctIndex
                      ).length;
                      const total = this.flashcards.length;
                      const percent = Math.round((correctCount / total) * 100);
                      const radius = 50;
                      const circumference = 2 * Math.PI * radius;
                      const offset = circumference * (1 - percent / 100);

                      return html`
                        <div>
                          <svg class="circular-progress" viewBox="0 0 120 120">
                            <circle
                              class="track"
                              cx="60"
                              cy="60"
                              r="${radius}"
                            ></circle>
                            <circle
                              class="progress"
                              cx="60"
                              cy="60"
                              r="${radius}"
                              stroke-dasharray="${circumference}"
                              stroke-dashoffset="${offset}"
                            ></circle>
                            <text x="60" y="65" class="progress-text">
                              ${percent}%
                            </text>
                          </svg>
                        </div>

                        <ul>
                          ${this.flashcards.map((card, index) => {
                            const userAnswer = card.userAnswer;
                            const correct = card.correctIndex;
                            const isCorrect = userAnswer === correct;

                            return html`
                              <li
                                class="summary-item ${isCorrect
                                  ? "correct"
                                  : "wrong"}"
                                @click=${() => {
                                  const toggled =
                                    this.shadowRoot!.querySelector(
                                      `#details-${index}`
                                    ) as HTMLElement;
                                  if (toggled) toggled.classList.toggle("open");
                                }}
                                style="cursor: pointer;"
                              >
                                <strong>Question ${card.id}:</strong>
                                ${card.question}
                                <div
                                  id="details-${index}"
                                  class="summary-details"
                                >
                                  <br />
                                  You chose:
                                  ${typeof userAnswer === "number"
                                    ? card.choices[userAnswer]
                                    : "–"}<br />
                                  ${isCorrect
                                    ? html`<b>Right!</b>`
                                    : html`<b>Wrong.</b> Right answer:
                                        ${card.choices[correct]}`}
                                </div>
                              </li>
                            `;
                          })}
                        </ul>
                      `;
                    })()}
              </div>
            `
          : null}

        <div class="progress-container">
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
    `;
  }
}
