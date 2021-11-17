import './style.scss';
import { createImage } from '../imgloader';
class Menu extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.#render();
  }
  async #render() {
    const template = `
      <div id="authors-quiz" class="menu-option">
        <div class="authors-quiz menu-image"></div>
        <p>Authors</p>
      </div>
      <div class="menu-option">
        <div class="pictures-quiz menu-image"></div>
        <p>Pictures</p>
      </div>`;
    this.classList.add('menu');
    this.innerHTML = template;
    this.addEventListener('click', this.#quizOption);
  }
  #quizOption(event) {
    const target = event.target.closest('.menu-option');
    if (!target) return false
    this.addEventListener('transitionend', (event) => {
      app.innerHTML = `<category-list id=${target.id}>`;
    }, { once: true });
    this.style.transform = 'translateX(-100vw)';
  }
}
customElements.define("main-menu", Menu);
