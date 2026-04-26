export class Struct {

  constructor(schema) {
    let totalLength = 0

    this.schema = new Map(
      Object.entries(schema).flatMap(([key, type]) => {
        const alignment = this.#getAlignment(totalLength, type.alignment ?? 1)

        const res = []

        if (alignment !== 0) {
          res.push([
            Symbol('Alignment'),
            {
              byteLength: alignment,
              init: () => {
                return {
                  get: () => 0,
                  set: (_value) = {},
                }
              }
            }
          ])
          totalLength += alignment
        }

        res.push([key, {
          byteLength: type.byteLength,
          init: type.init.bind(type)
        }])

        totalLength += type.byteLength

        return res
      }),
    )

    this.byteLength = totalLength

    console.log(this.schema)
    console.log(this.byteLength)
  }

  create(data, buffer = new ArrayBuffer(this.byteLength), offset = 0) {
    const view = new StructView(buffer, this.byteLength, offset)
    this.schema.forEach((type, key) => {
      const {get, set} = type.init(buffer, offset)

      if (typeof key !== 'symbol') {
        set(data[key])

        Object.defineProperty(view, key, {
          enumerable: true,
          configurable: true,
          get,
          set,
        })

        offset += type.byteLength
      }
    })
    return view
  }

  from(buffer, offset = 0) {
    const view = new StructView(buffer, this.byteLength, offset)

    this.schema.forEach((type, key) => {
      let accessors;

      const currentOffset = offset

      offset += type.byteLength

      if (typeof key !== 'symbol') {
        Object.defineProperty(view, key, {
          enumerable: true,
          configurable: true,
          get: () => init().get(),
          set: (value) => {
            init().set()
          },
        })


        function init() {
          if (accessors == null) {
            accessors = type.init(buffer, currentOffset)
          }

          return accessors
        }

      }
    })

    return view
  }

  init(buffer, offset = 0) {
    let view = this.from(buffer, offset)
    return {
      get: () => view,
      set: (data) => {
        view = this.create(data, buffer, offset)
      }
    }
  }

  #getAlignment(offset, size) {
    const remainder = offset % size

    if (remainder === 0) {
      return 0
    }

    return size - remainder
  }
}

class StructView {
  #buffer
  #byteLength
  #byteOffset

  get buffer() {
    return this.#buffer
  }

  get byteLength() {
    return this.#byteLength
  }

  get byteOffset() {
    return this.#byteOffset
  }

  constructor(buffer, byteLength, offset) {
    this.#buffer = buffer
    this.#byteLength = byteLength
    this.#byteOffset = offset
  }
}





















