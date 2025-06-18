import { css } from "lit";

export const flashcardsAppStyles = css`
  :host {
    display: block;
    font-family: sans-serif;
    width: 100dvw;
    height: 100dvh;
    font-family: stinger-variable, sans-serif;
  }

  .card-stack {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: 20px;
    width: 100%;
    height: calc(100dvh - 20px);
    transform: translate(-50%, -50%) rotateX(-10deg);
    perspective: 1000px;
    perspective-origin: 50% 40%;
    transform-style: preserve-3d;
    z-index: 0;
  }

  .card {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 50%;
    left: 50%;
    width: 80%;
    height: fit-content;
    max-width: 900px;
    min-height: 400px;
    background-color: var(--card-bg);
    color: var(--card-text);
    padding: 1.5rem 2rem;
    border: 1.5px solid var(--card-text);
    border-radius: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transform-style: preserve-3d;
    transform: translate3d(-50%, -50%, var(--z));
    transition: transform 0.4s ease, opacity 0.4s ease;
  }

  @media only screen and (max-width: 600px) {
    .card {
      padding: 0.75rem 1.5rem;
    }
  }

  .card.blurred {
    filter: blur(2px);
    pointer-events: none;
    user-select: none;
  }

  .card.final {
    max-height: 500px;
    overflow: auto;
    justify-content: space-evenly;
  }

  @media only screen and (min-height: 1000px) {
    .card.final {
      max-height: 900px;
    }
  }

  .card.postponed {
    background-color: #fff8c4;
    color: #5c4400;
    border: 1.5px solid #5c4400;
  }

  [data-theme='dark'] .card.postponed {
    background-color: #7a6700;
    color: #fff8c4;
    border: 1.5px solid #5c4400;
  }

  .card.postponed .choice-btn {
    color: #5c4400;
  }

  [data-theme='dark'] .card.postponed .choice-btn {
    color: #fff8c4;
  }

  .question {
    font-size: 1.25rem;
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .choice-btn {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1.05rem;
    letter-spacing: 0.025em;
    background-color: var(--choice-bg);
    color: var(--card-text);
    border: 1px solid transparent;
    border-radius: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
  }

  .choice-btn:hover:enabled {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .choice-btn.correct {
    background-color: var(--correct-bg);
    color: var(--correct-text);
    font-weight: bold;
    border-color: var(--correct-text);
  }

  .choice-btn.wrong {
    background-color: #f8d7da;
    color: #721c24;
    font-weight: bold;
    border-color: #721c24;
  }

  button {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 0.75rem;
    background-color: #4f46e5;
    color: white;
    cursor: pointer;
    font-family: stinger-variable, sans-serif;
  }

  .action-btn {
    margin-top: 4rem;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: 200px;
    align-self: flex-end;
  }

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

  .circular-progress {
    width: 120px;
    height: 120px;
    margin: 1.5rem auto;
    display: block;
  }

  .circular-progress circle {
    fill: none;
    stroke-width: 12;
    stroke-linecap: round;
  }

  .track {
    stroke: #e6e6e6;
  }

  .progress {
    stroke: #4f46e5;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 0.5s ease;
  }

  .progress-text {
    font-size: 1.25rem;
    font-weight: bold;
    fill: #4f46e5;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .summary-item {
    padding: 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
  }

  .summary-item.correct {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #065f46;
  }

  .summary-item.wrong {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #991b1b;
  }

  .summary-details {
    display: none;
    margin-top: 0.5rem;
  }

  .summary-details.open {
    display: block;
  }
`;
