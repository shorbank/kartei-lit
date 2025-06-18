import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("progress-bar")
export class ProgressBar extends LitElement {
  static styles = css`
    .progress-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background-color: rgba(224, 224, 224, 0.45);
      z-index: 2;
    }

    .progress-bar {
      height: 100%;
      background-color: #4f46e5;
      transition: width 0.3s ease;
    }
  `;

  @property({ type: Number }) percent = 0;

  render() {
    return html`
      <div class="progress-container">
        <div class="progress-bar" style="width: ${this.percent}%;"></div>
      </div>
    `;
  }
}
