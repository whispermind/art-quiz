import './style.scss'
import { hide } from '../../js/hideAnimation';
import { loadImage } from '../../js/imgloader';
import images from '../../js/data';
import { template } from './template';
const ROOT = document.querySelector('#app');
class quiz extends HTMLElement {
  constructor() {
    super();
    this.quizType = this.dataset.type;
    this.currentQuestion = Number(this.dataset.category);
    if (this.quizType === 'authors') this.currentQuestion += 12;
    this.currentQuestion *= 10;
    this.lastQuestion = this.currentQuestion - 10;
    this.score = 0;
  }
  connectedCallback() {
    this.classList.add('quiz');
    this.#render();
  }
  #render() {
    this.innerHTML = template;
    this.#nextQuestion();
  }
  #nextQuestion() {
    const questionContainer = document.querySelector('.question');
    const answersContainer = document.querySelector('.answers');
    answersContainer.addEventListener('click', event => {
      if (!event.target.closest('.answer')) return
      else this.#checkAnswer(event.target);
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

  }
  #checkAnswer(answer) {
    const imageURL = `../../images/img/${this.currentQuestion}.jpg`;
    const questionResult = document.querySelector('.question-result');
    const result = document.querySelector('.result');
    const next = document.querySelector('.next');
    const imageContainer = document.querySelector('.correct-image');
    const authorContainer = document.querySelector('.correct-author');
    if (answer.textContent === images[this.currentQuestion].author) { questionResult.classList.add('correct'); result.textContent = 'Correct'; this.score++ }
    else { questionResult.classList.add('wrong'); result.textContent = 'Wrong' }
    imageContainer.src = imageURL;
    authorContainer.textContent = `${images[this.currentQuestion].name} was painted by ${images[this.currentQuestion].author} in ${images[this.currentQuestion].year}`;
    next.addEventListener('click', event => {
      this.addEventListener('transitionend', event => {
        if (event.target !== this) return
        if (this.currentQuestion === this.lastQuestion) { this.#showResults(); return }
        this.currentQuestion--
        this.#render();
      }, { once: true });
      this.style.transform = '';
    });
    setTimeout(() => questionResult.style.transform = 'translateY(0)', 0);
  }
  #showResults() {
     
  }
  #toCategories() {

  }
  #showQuestion() {
    this.style.transform = `translateX(0)`;
  }
}
customElements.define("quiz-game", quiz);