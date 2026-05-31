import { Genotxt } from '@genotxt/GenotxtJS';

document.addEventListener('DOMContentLoaded', () => {
  const txt = document.getElementById('txt');
  const viewArea = document.getElementById('viewArea');
  const updateViewArea = () => {
    new Genotxt(document).generate(viewArea, txt.value);
  }
  let timer;

  txt.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(updateViewArea, 500);
  });
  updateViewArea();
});
