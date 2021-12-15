import './styles/normalize.css';
import './styles/styles.scss';
import './componens/menu';
import './componens/settings';
import './componens/category-list';
import './componens/quiz';
import './componens/results';
import hide from './js/hide';
import 'regenerator-runtime/runtime';

const ROOT = document.querySelector('#app');
(async function () {
  const { state } = await import('./js/state.js');
  const header = document.querySelector('.header-nav');
  const storage = localStorage.getItem('MYAPPSTATE');
  if (storage) {
    const obj = JSON.parse(storage);
    Object.assign(state, obj);
  }
  header.addEventListener('click', (clickEvent) => {
    const child = ROOT.firstElementChild;
    const isHomeButton = clickEvent.target.classList.contains('home-button');
    if (isHomeButton && child.classList.contains('menu')) return;
    child.addEventListener('transitionend', (event) => {
      if (clickEvent.target.classList.contains('settings-button')) {
        ROOT.innerHTML = `<settings-state>`;
      }
      if (isHomeButton) ROOT.innerHTML = `<main-menu>`;
    });
    hide(child);
  });

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('MYAPPSTATE', JSON.stringify(state));
  });
}());
