import {
  bus,
} from './bus'

const serialInterval = 80

describe('bus', () => {
  beforeEach(() => {
    jest.useFakeTimers()

    jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() =>
      new Date('2021-01-01T11:01:58.135Z').valueOf()
    )
    .mockImplementationOnce(() =>
      new Date('2021-01-01T11:02:58.135Z').valueOf()
    )
  })

  describe('bus', () => {
    const interval = 100
    const timeout  = 300

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

    describe('when there is a message dequeued', () => {
      const msg = {test: 'test'}
      let mock, b

      beforeEach(() => {
        mock = jest.fn()
        b = bus(mock, interval, timeout)
      })

      it('calls the consumer if it is not yet locked', () => {
        b.push(msg)
        b.start()

        jest.advanceTimersByTime(interval)

        expect(mock).toBeCalled()
      })

      it('does not call the consumer if it is locked', () => {
        b.push(msg)
        b.push(msg)
        b.start()

        jest.advanceTimersByTime(2 * interval)

        expect(mock).toBeCalledTimes(1)
      })

      it('calls the consumer if it is locked but past timeout', () => {
        b.push(msg)
        b.push(msg)
        b.start()

        jest.advanceTimersByTime(interval)
        jest.advanceTimersByTime(timeout)

        expect(mock).toBeCalledTimes(2)
      })

      it('calls the consumer if it is manually unlocked', () => {
        b.push(msg)
        b.push(msg)
        b.start()

        jest.advanceTimersByTime(interval)
        b.unlock()
        jest.advanceTimersByTime(interval)

        expect(mock).toBeCalledTimes(2)
      })
    })

    describe('when there is not a message in the queue', () => {
      it('does not call the consumer', () => {
        const mock = jest.fn()
        const b = bus(mock , interval)

        b.push()
        b.start()

        jest.advanceTimersByTime(interval)

        expect(mock).not.toBeCalled()
      })
    })
  })

})
