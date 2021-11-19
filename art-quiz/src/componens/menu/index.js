import './style.scss';
import '../category-list'
class Menu extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.#render();
  }
  async #render() {
    const template = `
      <div id="authors" class="menu-option">
        <div class="authors-quiz menu-image"></div>
        <p>Authors</p>
      </div>
      <div id="pictures" class="menu-option">
        <div class="pictures-quiz menu-image"></div>
        <p>Pictures</p>
      </div>`;
    this.classList.add('menu');
    this.innerHTML = template;
    this.style.transform = `translateX(0)`;
    this.addEventListener('click', this.#quizOption);
  }
  #quizOption(event) {
    const target = event.target.closest('.menu-option');
    if (!target) return false
    this.#showCategories(target.id);
  }
  #showCategories(id) {
    this.addEventListener('transitionend', (event) => {
      if (event.target !== this) return
      app.innerHTML = `<category-list class="categories" data-category=${id}>`;
    });
    this.style.transform = 'translateX(-100vw)';
  }
}
customElements.define("main-menu", Menu);
