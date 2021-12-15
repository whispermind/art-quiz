import './style.scss';
import hide from '../../js/hide';
import { loadImage } from '../../js/imgloader';
/* eslint no-magic-numbers: ["error", { "ignore": [1, 13] }]*/
const ROOT = document.querySelector('#app');
const CATEGORIES = {
  authors: {
    1: 'author category 1',
    2: 'author category 2',
    3: 'author category 3',
    4: 'author category 4',
    5: 'author category 5',
    6: 'author category 6',
    7: 'author category 7',
    8: 'author category 8',
    9: 'author category 9',
    10: 'author category 10',
    11: 'author category 11',
    12: 'author category 12',
  },
  pictures: {
    1: 'pictures category 1',
    2: 'pictures category 2',
    3: 'pictures category 3',
    4: 'pictures category 4',
    5: 'pictures category 5',
    6: 'pictures category 6',
    7: 'pictures category 7',
    8: 'pictures category 8',
    9: 'pictures category 9',
    10: 'pictures category 10',
    11: 'pictures category 11',
    12: 'pictures category 12',
  },
};
class CategoryList extends HTMLElement {
  async connectedCallback() {
    const { state } = await import('../../js/state');
    this.state = state;
    this.classList.add('categories');
    this.#render();
  }

  async #render() {
    const categoriesType = this.dataset.category;
    const authorQuizPosition = 0;
    const pictureQuizPosition = 120;
    const start = categoriesType === 'authors' ? authorQuizPosition : pictureQuizPosition;
    const imagesURL = await CategoryList.getImages(start);
    this.addCategories(imagesURL, categoriesType);

    setTimeout(() => {
      this.style.transform = 'translateX(0)';
    }, null);

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
      
      const stateIndex = `category-${
        type === 'authors' ? index + 13 : index + 1
      }`;
      const categoryItem = CategoryList.getCategory(this.state[stateIndex]);
      categoryItem.style.backgroundImage = `url(${elem.value.currentSrc})`;
      categoryItem.dataset.title = CATEGORIES[type][index + 1];
      categoryItem.dataset.number = index + 1;
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
