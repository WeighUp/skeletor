import { bus, serialBus, scaleBus } from './bus'

describe('bus', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  describe('bus', () => {
    it('returns the messages', () => {
      const b = bus()

      expect(b.messages()).toEqual([])
    })

    it('pushes messages into queue', () => {
      const b = bus()

      b.push({test : 'test'})

      expect(b.messages()).toEqual([{test : 'test'}])
    })

    it('clears queue', () => {
      const b = bus()

      b.push({test : 'test'})
      b.clear()

      expect(b.messages()).toEqual([])
    })

    it('starts the consumer loop', () => {
      const b = bus(() => {}, 1000)

      b.start()

      expect(setInterval)
      .toHaveBeenCalledTimes(1)

      expect(setInterval)
      .toHaveBeenLastCalledWith(
        expect.any(Function), 1000
      )
    })

    it('stops the consumer loop', () => {
      const b = bus(() => {}, 1000)

      b.start()
      b.stop()

      expect(setInterval)
      .toHaveBeenCalledTimes(1)

      expect(clearInterval)
      .toHaveBeenCalledTimes(1)
    })

    describe('when there is a message to pop', () => {
      const msg = {test: 'test'}
      let mock

      beforeEach(() => {
        mock = jest.fn()
      })

      it('calls the consumer if it exists', () => {
        const busWithConsumer = bus(mock , 1000)
        busWithConsumer.push(msg)
        busWithConsumer.start()

        jest.advanceTimersByTime(1000)

        expect(mock).toBeCalled()
      })

      it('does not call the consumer if it does not exist', () => {
        const busWithoutConsumer = bus(undefined, 1000)
        busWithoutConsumer.push(msg)
        busWithoutConsumer.start()

        jest.advanceTimersByTime(1000)

        expect(mock).not.toBeCalled()
      })
    })

    describe('when there is not a message in the queue', () => {
      it('does not call the consumer', () => {
        const mock = jest.fn()
        const busWithConsumer = bus(mock , 1000)

        busWithConsumer.push()
        busWithConsumer.start()

        jest.advanceTimersByTime(1000)

        expect(mock).not.toBeCalled()
      })
    })
  })

  describe('scaleBus', () => {
    it('sets the consumer loop at the appropriate interval', () => {
      const mock = jest.fn()
      const scaleB = scaleBus(mock)

      scaleB.push({test: 'test'})
      scaleB.start()
      jest.advanceTimersByTime(200)

      expect(mock).toBeCalled()
    })

    it('calls send() with the message when a message is dequeued', () => {
      const mock = jest.fn()
      const scaleB = scaleBus(mock)

      scaleB.push({test: 'test'})
      scaleB.start()
      jest.advanceTimersByTime(200)

      expect(mock).toBeCalledWith({test: 'test'})

    })
  })

  describe('serialBus', () => {
    it('returns the scale busses', () => {
      const b = serialBus()

      expect(b.scaleBusses()).toEqual({})
    })

    it('adds scale busses', () => {
      const b = serialBus()

      b.addScale('00B726F1')

      expect(b.scaleBusses()['00B726F1']).not.toBeNull()
    })

    it('removes scale busses', () => {
      const b = serialBus()

      b.addScale('00B726F1')
      b.removeScale('00B726F1')

      expect(b.scaleBusses()['00B726F1']).toBeUndefined()
    })

    it('adds a scale bus when message with address with no matching scale bus is dequeued', () => {
      const mock = jest.fn()
      const b = serialBus(mock)
      b.push({address: '00B726F1'})
      b.start()

      jest.advanceTimersByTime(20)

      expect(b.scaleBusses()['00B726F1']).not.toBeNull()
    })

    it('calls the consumer loop at the appropriate interval', () => {
      const mock = jest.fn()
      const b = serialBus(mock)

      b.push({test: 'test'})
      b.start()
      jest.advanceTimersByTime(20)

      expect(mock).toBeCalled()
    })

    it('calls send() with message when message with no address is dequeued', () => {
      const mock = jest.fn()
      const b = serialBus(mock)
      const msg = {test: 'test'}
      b.push(msg)
      b.start()

      jest.advanceTimersByTime(20)

      expect(mock).toBeCalledWith(msg)
    })

    it('pushes messages with address to the matching scale bus when dequeued', () => {
      const mock = jest.fn()
      const b = serialBus(mock)
      const msg = {address: '00B726F1'}
      b.push(msg)
      b.start()

      jest.advanceTimersByTime(20)

      expect(b.scaleBusses()['00B726F1'].messages()).toEqual([msg])
    })
  })
})
