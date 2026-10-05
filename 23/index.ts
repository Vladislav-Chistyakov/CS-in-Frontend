
function random (startNumber: number, endNumber: number) {
  return Iterator.from({
    next () {
      const randomNumber = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber
      return { value: randomNumber, done: false };
    }
  })
}

// const randomInt = random(0, 100);
// console.log(randomInt.next().value); // Случайное число от 0 до 100


