import './style.scss';
import hide from '../../js/hide';
import images from '../../js/data';
import { loadImage } from '../../js/imgloader';
/* eslint no-magic-numbers: ["error", { "ignore": [1, 13, 9] }]*/

const ROOT = document.querySelector('#app');
const authorsCategoryName = 'authors';
class quizResults extends HTMLElement {
  constructor() {
    super();
    this.quizType = this.dataset.type;
    this.currentImage = Number(this.dataset.category);
    if (this.quizType === authorsCategoryName) this.currentImage += 12;
    this.category = this.currentImage;
    this.currentImage *= 10;
    this.lastImage = this.currentImage - 9;
  }

  async connectedCallback() {
    const { state } = await import('../../js/state');
    this.state = state;
    this.classList.add('results');
    this.#render();
  }

  async #render() {
    const descriptions = [];
    const urls = [];
    const promises = [];
    for (let iter = this.currentImage; iter >= this.lastImage; iter -= 1) {
      urls.push(`./images/img/${iter}.jpg`);
      descriptions.push(
        `${images[iter].name} was painted by ${images[iter].author} in ${images[iter].year}`
      );
    }
    urls.forEach(async (url) => {
      promises.push(await loadImage(url));
    });
    await Promise.allSettled(promises);
    this.addImages(urls, descriptions);
    this.addButton();
  }

  addButton() {
    const button = document.createElement('button');
    button.textContent = 'CATEGORIES';
    button.classList.add('categories-button', 'btn', 'btn-outline-light');
    this.append(button);
    button.addEventListener('click', () => {
      this.addEventListener('transitionend', (event) => {
        if (event.target !== this) return;
        ROOT.innerHTML = `<category-list data-category=${this.quizType}>`;
      });
      hide(this);
    });
  }

  addImages(urls, descriptions) {
    urls.forEach((url, index) => {
      const container = document.createElement('div');
      const description = document.createElement('div');
      container.style.backgroundImage = `url(${url})`;
      container.classList.add('result-container');
      if (this.state[`category-${this.category}`][index] === 'true') {
        container.classList.add('correct-result');
      } else container.classList.add('wrong-result');
      description.textContent = descriptions[index];
      description.classList.add('result-description');
      container.append(description);
      this.append(container);
    });
    setTimeout(() => {
      this.style.transform = 'translateX(0)';
    }, 0);
  }
}
customElements.define('quiz-results', quizResults);
