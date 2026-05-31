// Общий размер памяти — 100 КБ
// Из них 10 КБ резервируется под стек, остальное — под кучу
const mem = new Memory(100 * 1024, { stack: 10 * 1024 });

class Memory {
  #arrayBuffer

  constructor(memory, options) {
    this.#arrayBuffer = new ArrayBuffer(memory);

    console.log('LENGTH', this.#arrayBuffer, this.#arrayBuffer.length);
  }
}

// ============================================
//  Работа со стеком (LIFO)
// ============================================

// Добавляем данные в стек
// Возвращает указатель на первый байт сохранённых данных
// const pointer1 = mem.push(arrayBuffer1);

// Добавляем ещё один блок в стек (ляжет поверх предыдущего)
// mem.push(arrayBuffer2);

// Извлекаем значение по указателю (без удаления из стека)
// console.log(pointer1.deref()); // arrayBuffer1

// Изменяем данные по указателю (заменяем содержимое)
// pointer1.change(arrayBuffer3);

// Удаляем последний добавленный блок из стека (LIFO)
// mem.pop(); // удаляет arrayBuffer2

// Удаляем следующий блок (теперь верхним стал arrayBuffer3)
// mem.pop(); // удаляет arrayBuffer3