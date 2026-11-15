function laugh() {
  console.log("Ha-ha!");
}
//
// function debounce (callback: () => void, ms: number) {
//   let timeoutId = 0
//   const customClearTimeout = () => clearTimeout(timeoutId)
//
//   return function () {
//     if (!!timeoutId) {
//       customClearTimeout()
//     }
//     timeoutId = setTimeout(callback, ms)
//   }
// }
//
// const debouncedLaugh = debounce(laugh, 5000);
//
// console.log('start')
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh(); // Выполнится через 5000 мс

function throttle (callback: () => void, ms: number) {
  let isPending = false
  let timeoutId = 0
  let popitka = 0

  const startTimeout = () => setTimeout(() => {
    isPending = false
    timeoutId = 0

    if (popitka) {
      callback()
      isPending = true
      timeoutId = startTimeout()
      popitka = 0
    }
  }, ms)

  return function () {
    if (isPending) {
      popitka = 1
    }

    if (!isPending) {
      callback()
      isPending = true
      timeoutId = startTimeout()
    }
  }
}

const throttledLaugh = throttle(laugh, 1000);

throttledLaugh(); // Выполнится сразу
throttledLaugh();
throttledLaugh();
throttledLaugh();
throttledLaugh(); // Выполнится через 1000 мс