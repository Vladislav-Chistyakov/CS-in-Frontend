// Класс для построения бора
// Необходимо реализовать класс для построения бора. Сам бор должен храниться внутри плоского массива.

type NodeTrie = {
  [k: string]: { [k: string]: number };
}
class Trie {
  borArrayView: NodeTrie[] = [{'': {}}]


  constructor() {
  }

  addWord (str: string) {
    this.borArrayView.push(str)
  }

  go (char: string) {

  }

  isWord () {
    console.log(this.borArrayView)
    return
  }
}

const trie = new Trie();

trie.addWord('мясо');
trie.addWord('мясорубка');
trie.addWord('мир');

console.log(trie.go('м').go('я').go('с').go('о').isWord()); // true