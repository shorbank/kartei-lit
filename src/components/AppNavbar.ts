import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("app-navbar")
export class AppNavbar extends LitElement {
  static styles = css`
    .header {
      position: absolute;
      display: flex;
      width: calc(100% - 32px);
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      z-index: 10;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .kartei-logo {
      width: 32px;
      height: 32px;
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
      background-color: rgba(0, 0, 0, 0.2);
    }

    .settings-btn svg {
      fill: var(--icon-color);
      transition: fill 0.3s;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .modal {
      background: var(--card-bg);
      color: var(--card-text);
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 70%;
      position: relative;
    }

    .modal h3 {
      margin-top: 0;
    }

    .close-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.75rem;
      background: none;
      border: none;
      font-size: 2rem;
      color: inherit;
      cursor: pointer;
    }

    .toggle-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
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
      content: "";
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
  `;

  @property({ type: Boolean }) showSettings = false;

  private toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  private toggleTheme(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const theme = checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  private isDarkMode() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  render() {
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
    `;
  }
}
