## Класс для построения бора

Необходимо реализовать класс для построения бора. Сам бор должен храниться внутри плоского массива.

```js
const trie = new Trie();

trie.addWord('мясо');
trie.addWord('мясорубка');
trie.addWord('мир');

console.log(trie.go('м').go('я').go('с').go('о').isWord()); // true
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
interface TrieNode {
    char: string;
    word: boolean;
    children: Map<string, number>;
}

class Trie {
    #buffer: TrieNode[] = [{ char: "", word: false, children: new Map() }];

    addWord(word: string) {
        let cursor = 0;

        for (const char of word) {
            const current = this.#buffer[cursor];

            if (current.children.has(char)) {
                cursor = current.children.get(char)!;

            } else {
                const trieNode = { char, word: false, children: new Map() };
                const pointer = this.#buffer.push(trieNode) - 1;
                current.children.set(char, pointer);
                cursor = pointer;
            }
        }

        this.#buffer[cursor].word = true;
    }

    go(char: string): TrieView {
        return new TrieView(0, this.#buffer).go(char);
    }
}

class TrieView {
    readonly #start: number;
    readonly #buffer: TrieNode[];

    constructor(start: number, buffer: TrieNode[]) {
        this.#start = start;
        this.#buffer = buffer;
    }

    go(char: string) {
        const s = this.#start;
        const buf = this.#buffer;
        return s === -1 || buf[s] == null ? this : new TrieView(buf[s].children.get(char) ?? -1, buf);
    }

    isWord(): boolean {
        const s = this.#start;
        const buf = this.#buffer;
        return s === -1 || buf[s] == null ? false : buf[s].word;
    }
}

const trie = new Trie();

trie.addWord("мясо");
trie.addWord("мясорубка");
trie.addWord("мир");

console.assert(trie.go("м").go("я").go("с").go("о").isWord());
console.assert(trie.go("м").go("и").go("р").isWord());
console.assert(!trie.go("м").go("и").go("г").isWord());
```

</details>

## Функция для определения множества строк по шаблону

Функция должна возвращать массив подходящих строк. Шаблон и строки состоят из разделителей и универсальных символов:

1. `*` — любой набор символов до следующего разделителя;
2. `**` — любой набор символов (должен обязательно находиться в конце шаблона).

```js
// ['foo.bla.bar.baz', 'foo.bag.bar.ban.bla']
console.log(match('foo.*.bar.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla'])); 
```

<details>
<summary><strong>Смотреть решение</strong></summary>

```typescript
import { deepEqual } from "node:assert";

class TrieNode {
    word = false;

    value: string[];
    children = new Map<string, TrieNode>();

    aliases: string[][] = [];
    wildcardChildren = new Map<string, TrieNode[]>();

    constructor(value: string[]) {
        this.value = value;
    }
}

class Trie {
    #root = new TrieNode([]);

    addWord(word: Iterable<string>) {
        let cursor = this.#root;
        let wildcard: TrieNode | null = null;

        for (const char of word) {
            const current = cursor;
            wildcard = current.children.has("*") ? current.children.get("*")! : createNode("*", current);

            if (current.children.has(char)) {
                cursor = current.children.get(char)!;

            } else {
                const trieNode = createNode(char, current);
                wrapSet(trieNode.children, wildcard.wildcardChildren);
                cursor = trieNode;
            }
        }

        if (wildcard != null) {
            cursor.word = true;
            wildcard.aliases.push(cursor.value);
        }

        function createNode(chunk: string, parent: TrieNode) {
            const trieNode = new TrieNode(parent.value.concat(chunk));
            parent.children.set(chunk, trieNode);
            return trieNode;
        }

        function wrapSet<K, V>(map: Map<K, V>, wildcardMap: Map<K, V[]>) {
            const { set } = map;

            Object.defineProperty(map, "set", {
                value(key: K, value: V) {
                    wildcardMap.set(key, [].concat(wildcardMap.get(key) ?? [], value));
                    return set.call(map, key, value);
                }
            })

            return wrapSet;
        }
    }

    go(char: string) {
        return new TrieView([this.#root]).go(char);
    }
}

class TrieView {
    #startNodes: TrieNode[];

    constructor(startNodes: TrieNode[]) {
        this.#startNodes = startNodes;
    }

    get isCompleted() {
        return this.#startNodes.length === 0;
    }

    get words(): string[][] {
        if (this.isCompleted) {
            return [];
        }

        return this.#startNodes.flatMap(({ word, value, aliases }) => word ? [value] : aliases);
    }

    go(char: string) {
        if (this.isCompleted) {
            return this;
        }

        const startNodes = this.#startNodes.flatMap((node) =>
            node.wildcardChildren.get(char) ?? node.children.get(char) ?? []);

        return new TrieView(startNodes);
    }
}

function match(pattern: string, strings: string[], separator = ".") {
    const result: string[] = [];

    const patternChunks = pattern.split(separator);
    const canExpandPattern = patternChunks.at(-1) === "**";

    if (patternChunks.length === 0) {
        return result;
    }

    const trie = new Trie();
    strings.forEach((str) => trie.addWord(str.split(separator)));

    if (canExpandPattern) {
        patternChunks.pop();
    }

    const minSize = patternChunks.length;
    const maxSize = canExpandPattern ? Infinity : minSize;

    let cursor: Trie | TrieView = trie;

    patternChunks.forEach((pattern) => {
        cursor = cursor.go(pattern);

        cursor.words.forEach((value) => {
            if (canExpandPattern ? value.length >= minSize : value.length === maxSize) {
                result.push(value.join(separator));
            }
        });
    });

    if (canExpandPattern) {
        for (cursor = cursor.go("*"); !cursor.isCompleted; cursor = cursor.go("*")) {
            result.push(...cursor.words.map((value) => value.join(separator)));
        }
    }

    return result;
}

deepEqual(
    match("foo.*", ["foo.baz", "foo.bar.bla"]),
    ["foo.baz"]
);

deepEqual(
    match("foo.*.bar.**", ["foo", "foo.bar", "foo.bla.bar.baz", "foo.bag.bar.ban.bla"]),
    [ "foo.bla.bar.baz", "foo.bag.bar.ban.bla" ]
);

const trie = new Trie();

trie.addWord("foo.bar".split("."));
trie.addWord("foo.bar".split("."));
trie.addWord("foo.qux".split("."));

deepEqual(
    trie.go("foo").go("*").words,
    [ [ "foo", "bar" ], [ "foo", "bar" ], [ "foo", "qux" ] ]
);
```

</details>