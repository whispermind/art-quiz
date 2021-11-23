import './style.scss'
import { loadImage } from '../../js/imgloader';
import { hide } from '../../js/hide'
import images from '../../js/data';
const ROOT = document.querySelector('#app');
class quizResults extends HTMLElement {
  constructor() {
    super();
    this.quizType = this.dataset.type;
    this.currentImage = Number(this.dataset.category);
    if (this.quizType === 'authors') this.currentImage += 12;
    this.category = this.currentImage;
    this.currentImage *= 10;
    this.lastImage = this.currentImage - 9;
  }
  async connectedCallback() {
    const { state } = await import('../../js/state.js');
    this.state = state;
    this.classList.add('results');
    this.#render();
  }
  async #render() {
    const descriptions = [];
    const urls = [];
    const promises = [];
    for (let i = this.currentImage; i >= this.lastImage; i--) {
      urls.push(`./images/img/${i}.jpg`);
      descriptions.push(`${images[i].name} was painted by ${images[i].author} in ${images[i].year}`);
    }
    urls.forEach(async (url) => promises.push(loadImage()));
    await Promise.allSettled(promises);
    urls.forEach((url, index) => {
      const container = document.createElement('div');
      const description = document.createElement('div');
      container.style.backgroundImage = `url(${url})`;
      container.classList.add('result-container');
      if (this.state[`category-${this.category}`][index] === 'true') container.classList.add('correct-result');
      else container.classList.add('wrong-result');
      description.textContent = descriptions[index];
      description.classList.add('result-description');
      container.append(description);
      this.append(container);
      setTimeout(() => this.style.transform = 'translateX(0)', 0);
    })
    const button = document.createElement('button');
    button.textContent = 'CATEGORIES';
    button.classList.add('categories-button');
    this.append(button);
    button.addEventListener('click', (clickEvent) => {
      this.addEventListener('transitionend', (event) => {
        if (event.target !== this) return
        ROOT.innerHTML = `<category-list data-category=${this.quizType}>`
      })
      hide(this);
    });
  }
}
customElements.define("quiz-results", quizResults);
