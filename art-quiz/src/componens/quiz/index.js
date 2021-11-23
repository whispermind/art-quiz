import './style.scss'
import { loadImage } from '../../js/imgloader';
import { hide } from '../../js/hideAnimation'
import images from '../../js/data';
import { template } from './template';
const ROOT = document.querySelector('#app');
class quiz extends HTMLElement {
  constructor() {
    super();
    this.quizType = this.dataset.type;
    this.currentQuestion = Number(this.dataset.category);
    if (this.quizType === 'authors') this.currentQuestion += 12;
    this.category = this.currentQuestion;
    this.currentQuestion *= 10;
    this.lastQuestion = this.currentQuestion - 9;
    this.score = 0;
    this.answers = [];
  }
  async connectedCallback() {
    this.state = await import('../../js/state.js');
    this.classList.add('quiz');
    this.#render();
  }
  #render() {
    this.innerHTML = template;
    const button = document.querySelector('.categories-button');
    button.addEventListener('click', () => this.#toCategories());
    this.#nextQuestion();
  }
  #nextQuestion() {
    const questionContainer = document.querySelector('.question');
    const answersContainer = document.querySelector('.answers');
    answersContainer.addEventListener('click', event => {
      if (!event.target.closest('.answer')) return
      this.#checkAnswer(event.target);
    });
    this.quizType === 'authors' ? this.#authorQuestion(questionContainer, answersContainer) : this.#imageQuestion(questionContainer, answersContainer);
  }
  async #authorQuestion(questionContainer, answersContainer) {
    questionContainer.textContent = `Who is the author of this picture?`
    const url = `../../images/img/${this.currentQuestion}.jpg`;
    const answers = [];
    await loadImage(url);
    answersContainer.insertAdjacentHTML('beforebegin', `<img src="${url}">`);
    answers.push(`${images[this.currentQuestion].author}`);
    while (answers.length !== 4) {
      const randomValue = Math.floor(Math.random() * (240 - 0 + 1)) + 0;
      if (!answers.includes(randomValue)) answers.push(`${images[randomValue].author}`);
    }
    answers.sort(() => Math.random() - Math.random());
    answers.forEach((elem) => {
      const div = document.createElement('div');
      div.textContent = elem;
      div.classList.add('answer');
      answersContainer.append(div);
    });
    this.#showQuestion();
  }
  async #imageQuestion(questionContainer, answersContainer) {
    questionContainer.textContent = `Which picture was painted by ${images[this.currentQuestion].author}?`;
    const urls = [`../../images/img/${this.currentQuestion}.jpg`];
    const promises = [];
    while (urls.length !== 4) {
      const url = `../../images/img/${Math.floor(Math.random() * (240 - 0 + 1)) + 0}.jpg`;
      if (!urls.includes(url)) urls.push(url);
    }
    urls.forEach((url) => {
      promises.push(loadImage(url));
    });
    const imagesLoaded = await Promise.allSettled(promises);
    imagesLoaded.forEach((elem) => {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = elem.value.currentSrc;
      div.append(img);
      div.classList.add('image-answer', 'answer');
      div.classList
      answersContainer.append(div);
    })
    this.#showQuestion();
  }
  #checkAnswer(answer) {
    const imageURL = `../../images/img/${this.currentQuestion}.jpg`;
    const questionResult = document.querySelector('.question-result');
    const result = document.querySelector('.result');
    const next = document.querySelector('.next');
    const imageContainer = document.querySelector('.correct-image');
    const authorContainer = document.querySelector('.correct-author');
    if (answer.textContent === images[this.currentQuestion].author || answer.src === imageURL) {
      questionResult.classList.add('correct');
      result.textContent = 'Correct';
      this.score++;
      this.answers.push('true');
    }
    else {
      questionResult.classList.add('wrong');
      result.textContent = 'Wrong'
      this.answers.push('false');
    }
    imageContainer.src = imageURL;
    authorContainer.textContent = `${images[this.currentQuestion].name} was painted by ${images[this.currentQuestion].author} in ${images[this.currentQuestion].year}`;
    next.addEventListener('click', event => {
      this.addEventListener('transitionend', event => {
        if (event.target !== this) return
        if (this.currentQuestion === this.lastQuestion) { this.#showResults(); return }
        this.currentQuestion--
        this.#render();
      }, { once: true });
      hide(this);
    });
    setTimeout(() => questionResult.style.transform = 'translateY(0)', 0);
  }
  #showResults() {
    const resultContainer = document.querySelector('.total-result');
    const score = document.querySelector('.score');
    const categoriesButton = document.querySelector('.close-button');
    const categoryAnswers = this.state[`category-${this.category}`];
    resultContainer.classList.add('show');
    score.textContent = `your score is ${this.score}/10`;
    categoriesButton.addEventListener('click', () => this.#toCategories());
    resultContainer.style.transform = `translateY(0)`;
    this.#showQuestion();
    if (!categoryAnswers) this.state[`category-${this.category}`] = {};
    this.answers.forEach((result, index) => {
      this.state[`category-${this.category}`][index] = result;
    });
  }
  #toCategories() {
    this.addEventListener('transitionend', (event) => {
      if (event.target !== this) return
      ROOT.innerHTML = `<category-list data-category=${this.quizType}>`;
    });
    hide(this);
  }
  #showQuestion() {
    this.style.transform = `translateX(0)`;
  }
}
customElements.define("quiz-game", quiz);