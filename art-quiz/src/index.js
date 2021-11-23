import './styles/normalize.css';
import './styles/styles.scss';
import './componens/menu';
import './componens/category-list';
import './componens/quiz';
const home = document.querySelector('.home-button');
home.addEventListener('click', event => {
  const child = app.firstChild;
  child.style.transform = '';
  child.addEventListener('transitionend', event => {
    app.innerHTML = `<main-menu>`;
  })
});

window.onbeforeunload = async () => {
  localStorage.setItem('MYAPPSTATE', await import('./js/state.js'));
}
window.onload = async () => {
  const storage = localStorage.getItem('MYAPPSTATE');
  if (storage) Object.assign(await import('./js/state.js'), storage);
}