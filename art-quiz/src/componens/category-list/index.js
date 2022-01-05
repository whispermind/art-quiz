import './style.scss';
import hide from '../../js/hide';
import { loadImage } from '../../js/imgloader';
/* eslint no-magic-numbers: ["error", { "ignore": [1, 13] }]*/
const ROOT = document.querySelector('#app');
const authorQuizPosition = 0;
const pictureQuizPosition = 120;
const authorsCategoryName = 'authors';
const authorsRange = 12;
class CategoryList extends HTMLElement {
  async connectedCallback() {
    const { state } = await import('../../js/state');
    this.state = state;
    this.classList.add('categories');
    this.#render();
  }

  async #render() {
    const categoriesType = this.dataset.category;
    const start = categoriesType === authorsCategoryName ? authorQuizPosition : pictureQuizPosition;
    const imagesURL = await CategoryList.getImages(start);
    this.addCategories(imagesURL, categoriesType);

    setTimeout(() => {
      this.style.transform = 'translateX(0)';
    }, 0);

    this.addEventListener('click', (clickEvent) => {
      const target = clickEvent.target.closest('.results-button')
        || clickEvent.target.closest('.category-item');
      if (!target) return;
      this.addEventListener('transitionend', (event) => {
        if (event.target !== this) return;
        const component = clickEvent.target.closest('.results-button')
          ? `<quiz-results data-type='${categoriesType}' data-category='${clickEvent.target.parentNode.dataset.number}'>`
          : `<quiz-game data-type='${categoriesType}' data-category='${clickEvent.target.dataset.number}'>`;
        ROOT.innerHTML = component;
      });
      hide(this);
    });
  }

  addCategories(images, type) {
    images.forEach((elem, index) => {
      const incIndex = index + 1;
      const stateIndex = `category-${
        type === authorsCategoryName ? incIndex + authorsRange : incIndex
      }`;
      const categoryItem = CategoryList.getCategory(this.state[stateIndex]);
      categoryItem.style.backgroundImage = `url(${elem.value.currentSrc})`;
      categoryItem.dataset.title = `${type} category ${incIndex};`
      categoryItem.dataset.number = incIndex;
      if (!categoryItem.classList.contains('unplayed')) {
        categoryItem.append(CategoryList.getResults());
      }
      this.append(categoryItem);
    });
  }

  static getResults() {
    const results = document.createElement('div');
    results.textContent = 'RESULTS';
    results.classList.add('results-button');
    return results;
  }

  static getCategory(played) {
    const categoryItem = document.createElement('div');
    let correctAnswers = 0;
    if (played) {
      Object.keys(played).forEach((key) => {
        if (played[key] === 'true') correctAnswers += 1;
      });
    } else {
      categoryItem.classList.add('unplayed');
    }
    categoryItem.dataset.answered = `${String(correctAnswers)}/10`;
    categoryItem.classList.add('category-item');
    return categoryItem;
  }

  static getImages(start) {
    const images = [];
    const imageAmount = 12;
    for (let pos = 0; pos < imageAmount; pos += 1) {
      images.push(loadImage(`./images/img/${start + pos}.jpg`));
    }
    return Promise.allSettled(images);
  }
}
customElements.define('category-list', CategoryList);
