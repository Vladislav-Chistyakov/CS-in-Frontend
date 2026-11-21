type ResultState<T> =
  | { ok: true; value: T }
  | { ok: false; error: unknown }

class Result<T>{
  #state: ResultState<T>

  get state () {
    return this.#state
  }

  constructor(callback: () => T) {
    this.#state = this.capture<T>(() => callback())
  }

  capture<T>(callback: () => T): ResultState<T> {
    try {
      return { ok: true, value: callback()}
    } catch (e) {
      return { ok: false, error: e }
    }
  }

  then(callback: (data: T) => void) {
    if (this.state.ok) {
      callback(this.state.value)
    }

    return this
  }

  catch(callback: (data: unknown) => void) {
    if (!this.state.ok) {
      callback(this.state.error)
    }

    return this
  }
}

const result = new Result( () => {
  return 42
})

const failed = new Result(() => { throw 'Boom!' })

failed
  .then(data => console.log('Успех', data))
  .catch(err => console.log('Ошибка', err))

function exec<T>(createIterator: () => Generator<Result<T>, void, T>) {
  const iterator = createIterator()
  const step = iterator.next()

  function handlerStep(currentStep: IteratorResult<Result<T>>) {

    if (!currentStep.done) {
      currentStep.value
        .then((data) => {
          const nextStep = iterator.next(data)
          handlerStep(nextStep)
        })
        .catch((err) => {
          const nextStep = iterator.throw(err)
          handlerStep(nextStep)
        })
    }
  }

  handlerStep(step)
}

function* demo(): Generator<Result<number>, void, number> {

  console.log('Первый', yield result)
  try {
    console.log('Второй', yield failed)
  } catch (e) {
    console.error('eeee', e)
  }
  console.log('Третий', yield result)
}

exec(demo)
