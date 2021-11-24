import './style.scss'
import { template } from './template';
import { hide } from '../../js/hide'
const ROOT = document.querySelector('#app');
class settings extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    const { state } = await import('../../js/state.js');
    this.state = state;
    this.classList.add('settings');
    this.#render();
  }
  #render() {
    const timer = document.querySelector('#timer');
    const sounds = document.querySelector('#sounds');
    const timing = document.querySelector('#timing');
    this.innerHTML = template;
    setTimeout(() => this.style.transform = `translateX(0)`, 0);
    timer.checked = this.state.settings.timer;
    sounds.checked = this.state.settings.sounds;
    timing.value = this.state.settings.timing;
    this.addEventListener('change', (event) => {
      if (event.target === timer) this.state.timer = event.target.checked;
      if (event.target === sounds) this.state.sounds = event.target.checked;
      if (event.target === timing) this.state.timing = event.target.value;
    });
  }
}
customElements.define("settings-state", settings);