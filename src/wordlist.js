export class WordList {
  constructor() {
    this.words = [];
  }

  addWord(word, description) {
    this.words.push({ word, description });
  }

  removeWord(word) {
    this.words = this.words.filter(entry => entry.word !== word);
  }

  updateDescription(word, description) {
    this.words = this.words.map(entry =>
      entry.word === word ? { ...entry, description } : entry
    );
  }

  getWords() {
    return this.words;
  }
}