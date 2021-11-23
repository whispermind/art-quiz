import './style.scss'
import { hide } from '../../js/hideAnimation';
import { loadImage } from '../../js/imgloader';
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
  }
}
class CategoryList extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    this.state = await import('../../js/state.js');
    this.classList.add('categories');
    this.#render();
    console.log(this.state);
  }
  async #render() {
    const categoriesType = this.dataset.category;
    const start = categoriesType === 'authors' ? 0 : 120;
    const imagesURL = await this.#getImages(start);
    imagesURL.forEach((elem, index) => {
      const categoryItem = document.createElement('div');
      categoryItem.classList.add('category-item');
      categoryItem.style.backgroundImage = `url(${elem.value.currentSrc})`;
      categoryItem.dataset.title = CATEGORIES[categoriesType][index + 1];
      categoryItem.dataset.number = index + 1;
      this.append(categoryItem);
    });
    setTimeout(() => this.style.transform = 'translateX(0)', 0);
    this.addEventListener('click', (clickEvent) => {
      if (!clickEvent.target.closest('.category-item')) return
      this.addEventListener('transitionend', (event) => {
        if (event.target !== this) return
        ROOT.innerHTML = `<quiz-game data-type='${categoriesType}' data-category='${clickEvent.target.dataset.number}'>`;
      });
      hide(this);
    });
  }
  async #getImages(start) {
    const images = [];
    for (let i = 0; i < 12; i++)
      images.push(loadImage(`../../images/img/${start + i}.jpg`));
    return Promise.allSettled(images);
  }
}
customElements.define("category-list", CategoryList);
