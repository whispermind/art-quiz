import "./style.scss";
import hide from "../../js/hide";
import images from "../../js/data";
import { loadImage } from "../../js/imgloader";
import { template } from "./template";
import wrongSound from "./sounds/kaspersky.mp3";
import correctSound from "./sounds/coin.wav";
import endSound from "./sounds/end.wav";

const ROOT = document.querySelector("#app");
const authorsCategoryName = "authors";
const authorsRange = 12;
const maxPicturesRange = 240;
const minPicturesRange = 1;

class quiz extends HTMLElement {
  constructor() {
    super();
    this.quizType = this.dataset.type;
    this.currentQuestion = Number(this.dataset.category);
    if (this.quizType === authorsCategoryName)
      this.currentQuestion += authorsRange;
    this.category = this.currentQuestion;
    this.currentQuestion *= 10;
    this.lastQuestion = this.currentQuestion - 10;
    this.score = 0;
    this.answers = [];
  }

  async connectedCallback() {
    const { state } = await import("../../js/state");
    this.state = state;
    this.classList.add("quiz");
    this.render();
  }

  disconnectedCallback() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    this.innerHTML = template;
    this.processed = false;
    const button = document.querySelector(".categories-button");
    button.addEventListener("click", () => this.toCategories());
    this.setQuestion();
  }

  setQuestion() {
    const questionContainer = document.querySelector(".question");
    const answersContainer = document.querySelector(".answers");
    answersContainer.addEventListener("click", (event) => {
      if (!event.target.closest(".answer") || this.processed) return;
      this.processed = true;
      this.checkAnswer(event.target);
    });
    if (this.state.settings.timer) this.setTimer();
    if (this.quizType === authorsCategoryName)
      this.authorQuestion(questionContainer, answersContainer);
    else this.imageQuestion(questionContainer, answersContainer);
  }

  setTimer() {
    const timer = document.createElement("div");
    const container = document.querySelector(".navigation");
    timer.classList.add("timer");
    // this.append(timer);
    container.append(timer);
    this.timer(Number(this.state.settings.timing), timer);
  }

  unsetTimer() {
    //if (this.state.settings.timer) document.querySelector(".timer").remove();
  }

  async authorQuestion(questionContainer, answersContainer) {
    const container = questionContainer;
    const url = `./images/img/${this.currentQuestion}.jpg`;
    const answerAmount = 4;
    const answers = this.randomizeQuestions(answerAmount);
    await loadImage(url);
    container.textContent = `Who is the author of this picture?`;
    answersContainer.insertAdjacentHTML("beforebegin", `<img src="${url}">`);
    quiz.randomSort(answers);
    quiz.addAuthorQuestion(answers, answersContainer);
    this.showFrame();
  }

  static addAuthorQuestion(arr, container) {
    arr.forEach((elem) => {
      const div = document.createElement("div");
      div.textContent = elem;
      div.classList.add("answer");
      container.append(div);
    });
  }

  randomizeQuestions(amount) {
    const quizOption = [];
    const type = this.quizType === authorsCategoryName;
    quizOption.push(
      type
        ? `${images[this.currentQuestion].author}`
        : `./images/img/${this.currentQuestion}.jpg`
    );
    while (quizOption.length !== amount) {
      const randomValue = quiz.getRandom(maxPicturesRange, minPicturesRange);
      const str = type
        ? `${images[randomValue].author}`
        : `./images/img/${quiz.getRandom(
            maxPicturesRange,
            minPicturesRange
          )}.jpg`;
      if (!quizOption.includes(`${str}`)) quizOption.push(`${str}`);
    }
    return quizOption;
  }
  static getRandom(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async imageQuestion(questionContainer, answersContainer) {
    const container = questionContainer;
    const answerAmount = 4;
    container.textContent = `Which picture was painted by ${
      images[this.currentQuestion].author
    }?`;
    const urls = this.randomizeQuestions(answerAmount);
    const promises = [];
    urls.forEach((url) => {
      promises.push(loadImage(url));
    });
    const imagesLoaded = await Promise.allSettled(promises);
    imagesLoaded.sort(() => Math.random() - Math.random());

    imagesLoaded.forEach((elem) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = elem.value.currentSrc;
      div.append(img);
      div.classList.add("image-answer", "answer");
      answersContainer.append(div);
    });
    this.showFrame();
  }

  checkAnswer(answer, end) {
    const imageURL = this.setCorrectDescription(
      `./images/img/${this.currentQuestion}.jpg`
    );
    const answerButton = answer;
    let isCorrect = false;
    if (
      (!end && answer.textContent === images[this.currentQuestion].author) ||
      (!end &&
        this.quizType === "pictures" &&
        answer.src.slice(answer.src.lastIndexOf("/"), answer.src.length) ===
          imageURL.slice(imageURL.lastIndexOf("/"), imageURL.length))
    ) {
      answerButton.style.backgroundColor = "green";
      isCorrect = true;
    } else if (!end) {
      answerButton.style.backgroundColor = "red";
    }
    this.setResult(isCorrect);
    this.setCorrectDescription(imageURL);
    this.nextEvent();
  }

  setCorrectDescription(imageURL) {
    const imageContainer = document.querySelector(".correct-image");
    const authorContainer = document.querySelector(".correct-author");
    clearInterval(this.interval);
    imageContainer.src = imageURL;
    authorContainer.textContent = `${
      images[this.currentQuestion].name
    } was painted by ${images[this.currentQuestion].author} in ${
      images[this.currentQuestion].year
    }`;
    return imageURL;
  }

  setResult(status) {
    const questionResult = document.querySelector(".question-result");
    const resultContainer = document.querySelector(".result");
    resultContainer.textContent = status ? "Correct" : "Wrong";
    questionResult.classList.add(status ? "correct" : "wrong");
    this.play(status ? correctSound : wrongSound);
    if (status) {
      this.score += 1;
      this.answers.push("true");
    } else {
      this.answers.push("false");
    }
    setTimeout(() => {
      questionResult.style.transform = "translateY(0)";
      this.unsetTimer();
    }, 0);
  }

  nextEvent() {
    const next = document.querySelector(".next");
    const transitionHandler = (event) => {
      if (event.target !== this) return;
      this.removeEventListener("transitionend", transitionHandler);
      if (this.currentQuestion === this.lastQuestion) {
        this.play(endSound);
        this.showResults();
        return;
      }
      this.currentQuestion -= 1;
      this.render();
    };
    next.addEventListener(
      "click",
      () => {
        this.addEventListener("transitionend", transitionHandler);
        hide(this);
      },
      { once: true }
    );
  }

  showResults() {
    const resultContainer = document.querySelector(".total-result");
    const score = document.querySelector(".score");
    const categoriesButton = document.querySelector(".close-button");
    resultContainer.classList.add("show");
    resultContainer.style.transform = `translateY(0)`;
    score.textContent = `your score is ${this.score}/10`;
    categoriesButton.addEventListener("click", () => this.toCategories());
    this.showFrame();
    this.saveState();
  }

  saveState() {
    const categoryAnswers = this.state[`category-${this.category}`];
    if (!categoryAnswers) this.state[`category-${this.category}`] = {};
    this.answers.forEach((result, index) => {
      this.state[`category-${this.category}`][index] = result;
    });
  }

  play(src) {
    // const audio = new Audio(src);
    // audio.volume = this.state.settings.volume;
    // if (this.state.settings.sounds) audio.play();
  }

  static randomSort(arr) {
    arr.sort(() => Math.random() - Math.random());
  }

  toCategories() {
    this.addEventListener("transitionend", (event) => {
      if (event.target !== this) return;
      ROOT.innerHTML = `<category-list data-category=${this.quizType}>`;
    });
    hide(this);
  }

  showFrame() {
    this.style.transform = `translateX(0)`;
  }

  timer(timing, container) {
    let timeLeft = timing;
    const timerContainer = container;
    const interval = 1000;
    timerContainer.textContent = timing;
    this.interval = setInterval(() => {
      timeLeft -= 1;
      timerContainer.textContent = `${timeLeft}s`;
      if (!timeLeft) {
        clearInterval(this.interval);
        this.checkAnswer(null, true);
      }
    }, interval);
  }
}
customElements.define("quiz-game", quiz);
