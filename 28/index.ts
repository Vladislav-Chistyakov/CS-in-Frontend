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