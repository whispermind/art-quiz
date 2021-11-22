import './style.scss';
import { hide } from '../../js/hideAnimation'
import { template } from './template';
const ROOT = document.querySelector('#app');
class Menu extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.classList.add('menu');
    this.#render();
  }
  #render() {
    this.innerHTML = template;
    setTimeout(() => this.style.transform = `translateX(0)`, 0);
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
      ROOT.innerHTML = `<category-list data-category=${id}>`;
    });
    hide(this);
  }
}
customElements.define("main-menu", Menu);
