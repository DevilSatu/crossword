import './style.css';
import { renderWordList } from './renderers.js';
import { WordList } from './wordlist.js';

const root = document.querySelector('#root');
root.innerHTML = `<div id="app"></div>`;
const app = root.querySelector('#app');

const form = document.getElementById('word-form');
const wordInput = document.getElementById('word-input');
const descInput = document.getElementById('desc-input');

const gridSize = 10;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
let selectedWord = null;
let direction = 'horizontal'; 

const renderGrid = () => {
  const cells = grid
    .map((row, rowIndex) =>
      row
        .map(
          (letter, colIndex) => `
            <button class="grid-cell"
                    data-row="${rowIndex}"
                    data-col="${colIndex}">
              ${letter ?? ''}
            </button>`
        )
        .join('')
    )
    .join('');

  const selectedInfo = selectedWord
    ? `<p>Выбрано слово: <strong>${selectedWord}</strong> (${direction})</p>`
    : '<p>Нажми «Выбрать» у слова, чтобы вставить его в сетку.</p>';

  return `
    <div class="grid-panel">
      <h3>Сетка 10×10</h3>
      ${selectedInfo}
      <div class="grid">${cells}</div>
    </div>
  `;
};

const render = () => {
  app.innerHTML = `
    ${renderWordList(wl)}
    ${renderGrid()}
  `;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const word = wordInput.value.trim();
  const description = descInput.value.trim();
  if (!word || !description) return;

  wl.addWord(word, description);
  wordInput.value = '';
  descInput.value = '';
  render();
});

app.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('delete-btn')) {
    wl.removeWord(target.dataset.word);
    render();
    return;
  }

  if (target.classList.contains('edit-btn')) {
    const word = target.dataset.word;
    const current = wl.getWords().find((entry) => entry.word === word);
    const nextDescription = prompt('Новое описание:', current?.description ?? '');
    if (!nextDescription) return;
    wl.updateDescription(word, nextDescription.trim());
    render();
    return;
  }

  if (target.classList.contains('select-btn')) {
    selectedWord = target.dataset.word;
    render();
    return;
  }

  if (target.classList.contains('grid-cell')) {
    if (!selectedWord) {
      alert('Сначала выбери слово.');
      return;
    }
    placeWord(selectedWord, Number(target.dataset.row), Number(target.dataset.col));
  }
});

const placeWord = (word, row, col) => {
  if (direction === 'horizontal') {
    if (col + word.length > gridSize) {
      alert('Слово не помещается по горизонтали.');
      return;
    }
    for (let i = 0; i < word.length; i++) {
      const existing = grid[row][col + i];
      if (existing && existing !== word[i]) {
        alert('Буквы конфликтуют, выбери другое место.');
        return;
      }
    }
    for (let i = 0; i < word.length; i++) {
      grid[row][col + i] = word[i];
    }
  } else {
    if (row + word.length > gridSize) {
      alert('Слово не помещается по вертикали.');
      return;
    }
    for (let i = 0; i < word.length; i++) {
      const existing = grid[row + i][col];
      if (existing && existing !== word[i]) {
        alert('Буквы конфликтуют, выбери другое место.');
        return;
      }
    }
    for (let i = 0; i < word.length; i++) {
      grid[row + i][col] = word[i];
    }
  }

  selectedWord = null;
  render();
};

setTimeout(render, 0);

// Код, начиная с этого места НЕ меняем
const wl = new WordList();

wl.addWord('повар', 'такая профессия');
wl.addWord('чай', 'вкусный, делает меня человеком');
wl.addWord('яблоки', 'с ананасами');
wl.addWord('сосисочки', 'я — Никита Литвинков!');

app.innerHTML = renderWordList(wl);