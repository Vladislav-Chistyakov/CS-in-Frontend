function laugh() {
  console.log("Ha-ha!");
}

function debounce (callback: () => void, ms: number) {
  let timeoutId = 0
  const customClearTimeout = () => clearTimeout(timeoutId)

  return function () {
    if (!!timeoutId) {
      customClearTimeout()
    }
    timeoutId = setTimeout(callback, ms)
  }
}

const debouncedLaugh = debounce(laugh, 5000);

console.log('start')
debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh(); // Выполнится через 5000 мс