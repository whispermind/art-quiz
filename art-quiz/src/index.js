import './styles/normalize.css';
import './styles/styles.scss';
import './componens/menu';
import './componens/category-list';
import './componens/quiz';
import './componens/results'
(async function () {
  const { state } = await import('./js/state.js')
  const home = document.querySelector('.home-button');
  const storage = localStorage.getItem('MYAPPSTATE');
  if (storage) {
    const obj = JSON.parse(storage);
    Object.assign(state, obj);
  }
  home.addEventListener('click', event => {
    const child = app.firstChild;
    child.style.transform = '';
    child.addEventListener('transitionend', event => {
      app.innerHTML = `<main-menu>`;
    })
  });

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('MYAPPSTATE', JSON.stringify(state));
  });
})();