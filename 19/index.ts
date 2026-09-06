// Класс для построения бора
// Необходимо реализовать класс для построения бора. Сам бор должен храниться внутри плоского массива.

type NodeTrie = {
  [k: string]: { [k: string]: number | boolean | undefined, endWord?: boolean };
}

class Trie {
  borArrayView: NodeTrie[] = []

  constructor() {
    this.borArrayView[0] = {'': {}}
  }

  getElement (index: number): NodeTrie | undefined {
    return this.borArrayView?.[index] ?? undefined
  }

  addWord (str: string) {
    const parseStr = [...str]
    const lengthStr = parseStr.length

    if (lengthStr === 0) {
      return
    }

    let prevChar: string = ''
    let indexTrie: number  = 0

    for (let indexStr = 0; indexStr < lengthStr; indexStr++) {
      const charStr = parseStr[indexStr]

      const prevElement = this.getElement(indexTrie)?.[prevChar]

      const nodeCharStr = prevElement?.[charStr] ?? undefined

      if (prevElement && nodeCharStr) {
        if (typeof prevElement[charStr] !== 'number') {
          throw new Error(`Unrecognized char: ${charStr}`)
        }

        indexTrie = prevElement[charStr]
        prevChar = charStr
      } else {
        const el = this.getElement(indexTrie)?.[prevChar]
        indexTrie = this.borArrayView.length
        prevChar = charStr

        if (!el) {
          throw Error('Element для записи не существует')
        }

        const indexNewElement = this.borArrayView.length
        el[charStr] = indexNewElement
        this.borArrayView[indexNewElement] = this.createNode(charStr)
      }
    }

    const el = this.getElement(indexTrie)?.[prevChar]
    if (el) {
      el.endWord = true
    }
  }

  createNode (char: string): NodeTrie {
    return {[char]: {}}
  }

  getElementForCursor (index: number, bor: NodeTrie[]): NodeTrie | undefined {
    return bor?.[index] ?? undefined
  }

  go (char: string) {
    return new TrieCursor(char, this.borArrayView, this.getElementForCursor)
  }
}

class TrieCursor {
  str = ''
  bor: NodeTrie[] = []
  getElement: (index: number, bor: NodeTrie[]) => NodeTrie | undefined;

  constructor(str: string, bor: NodeTrie[], getElement: (index: number, bor: NodeTrie[]) => NodeTrie | undefined) {
    this.str = str
    this.bor = bor
    this.getElement = getElement
  }

  go (char: string) {
    this.str = this.str + char
    return new TrieCursor(this.str, this.bor, this.getElement)
  }

  isWord () {
    const lengthStr = this.str.length

    let prevChar: string = ''
    let indexTrie: number  = 0


    if (lengthStr === 0) {
      return false
    }

    for (let indexStr = 0; indexStr < lengthStr; indexStr++) {
      const charStr = this.str[indexStr]

      const prevElement = this.getElement(indexTrie, this.bor)?.[prevChar]

      const nodeCharStr = prevElement?.[charStr] ?? undefined

      if (prevElement && nodeCharStr) {
        if (typeof prevElement[charStr] !== 'number') {
          throw new Error(`Unrecognized char: ${charStr}`)
        }

        indexTrie = prevElement[charStr]
        prevChar = charStr
      } else {
        return false
      }
    }

    const el = this.getElement(indexTrie, this.bor)?.[prevChar]

    return el?.endWord ?? false
  }
}

const trie = new Trie();

trie.addWord('мясо');
trie.addWord('мясорубка');
trie.addWord('мир');

console.log(trie.go('м').go('и').go('р').isWord()); // true

console.log('borArrayView', trie.borArrayView)