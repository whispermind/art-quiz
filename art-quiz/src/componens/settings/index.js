import './style.scss';
import { template } from './template';

class settings extends HTMLElement {
  async connectedCallback() {
    const { state } = await import('../../js/state');
    this.state = state;
    this.classList.add('settings');
    this.render();
    this.setState();
  }

  render() {
    this.innerHTML = template;
    this.timer = document.querySelector('#timer');
    this.sounds = document.querySelector('#sounds');
    this.timing = document.querySelector('#timing');
    this.volume = document.querySelector('#volume');
    setTimeout(() => {
      this.style.transform = `translateX(0)`;
    }, null);
    this.timing.onkeypress = () => false;
  }

  setState() {
    this.timer.checked = this.state.settings.timer;
    this.sounds.checked = this.state.settings.sounds;
    this.timing.value = this.state.settings.timing;
    this.volume.value = this.state.settings.volume;
    this.addEventListener('change', (event) => {
      if (event.target === this.timer) this.state.settings.timer = event.target.checked;
      if (event.target === this.sounds) this.state.settings.sounds = event.target.checked;
      if (event.target === this.timing) this.state.settings.timing = event.target.value;
      if (event.target === this.volume) this.state.settings.volume = event.target.value;
    });
  }
}
customElements.define('settings-state', settings);
