import { FairbanksParser } from './parser-fairbanks'

describe('FairbanksParser', () => {
  const msg1 = [0x3c, 0x10, 0x00, 0xb7, 0x9b, 0xbd, 0x77, 0x20, 0x30, 0x30, 0x39, 0x30, 0x34, 0x2e, 0x30, 0x20, 0xd5, 0x3e],
        msg2 = [0x3c, 0x10, 0x00, 0xb7, 0x2e, 0xe5, 0x77, 0x20, 0x30, 0x30, 0x35, 0x37, 0x35, 0x2e, 0x35, 0x20, 0x37, 0x3e],
        msg3 = [0x3c, 0x10, 0x00, 0xb7, 0x2e, 0xe5, 0x77, 0x20, 0x30, 0x30, 0x35, 0x37, 0x35, 0x2e, 0x35, 0x3e, 0x37, 0x3e]

  it('parses when delimiter is in correct position according to length-byte', () => {
    const fn = jest.fn()
    const parser = new FairbanksParser({delimiter: '>'})
    parser.on('data', fn)

    parser.write(Buffer.from(msg1))

    expect(fn).toBeCalledWith(Buffer.from(msg1))
  })

  it('uses ">" as default delimiter', () => {
    const fn = jest.fn()
    const parser = new FairbanksParser()
    parser.on('data', fn)

    parser.write(Buffer.from(msg1))

    expect(fn).toBeCalledWith(Buffer.from(msg1))
  })

  it('parses messages that cross chunk boundaries', () => {
    const fn = jest.fn()
    const parser = new FairbanksParser()
    parser.on('data', fn)

    parser.write(Buffer.from([...msg1, ...msg2.slice(0, 4)]))
    parser.write(Buffer.from(msg2.slice(4)))
    parser.write(Buffer.from('even you!'))

    expect(fn).nthCalledWith(1, Buffer.from([...msg1]))
    expect(fn).nthCalledWith(2, Buffer.from([...msg2]))
    expect(fn).toBeCalledTimes(2)
  })

  it('does not parse when delimiter is in incorrect position', () => {
    const fn = jest.fn()
    const parser = new FairbanksParser()
    parser.on('data', fn)

    parser.write(Buffer.from(msg3.slice(0, msg3.length - 2)))

    expect(fn).not.toBeCalled()
  })

  it('parses when delimiter is in both correct position and another position', () => {
    const fn = jest.fn()
    const parser = new FairbanksParser()
    parser.on('data', fn)

    parser.write(Buffer.from(msg3))

    expect(fn).toBeCalledWith(Buffer.from(msg3))
  })

//
//  it('flushes remaining data when the stream ends', () => {
//    const parser = new DelimiterParser({ delimiter: Buffer.from([0]) })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(Buffer.from([1]))
//    assert.equal(spy.callCount, 0)
//    parser.end()
//    assert.equal(spy.callCount, 1)
//    assert.deepEqual(spy.getCall(0).args[0], Buffer.from([1]))
//  })
//
//
  it('throws when called with a 0 length delimiter', () => {
    expect(() => {
      new FairbanksParser({
        delimiter: Buffer.alloc(0),
      }).toThrow()
    })

    expect(() => {
      new FairbanksParser({
        delimiter: Buffer.alloc(''),
      }).toThrow()
    })

    expect(() => {
      new FairbanksParser({
        delimiter: Buffer.alloc([]),
      }).toThrow()
    })
  })
//
//  it('allows setting of the delimiter with a string', () => {
//    new DelimiterParser({ delimiter: 'string' })
//  })
//
//  it('allows setting of the delimiter with a buffer', () => {
//    new DelimiterParser({ delimiter: Buffer.from([1]) })
//  })
//
//  it('allows setting of the delimiter with an array of bytes', () => {
//    new DelimiterParser({ delimiter: [1] })
//  })
//
//  it('emits data events every time it meets 00x 00x', () => {
//    const data = Buffer.from('This could be\0\0binary data\0\0sent from a Moteino\0\0')
//    const parser = new DelimiterParser({ delimiter: [0, 0] })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(data)
//    assert.equal(spy.callCount, 3)
//    assert.deepEqual(spy.getCall(0).args[0], Buffer.from('This could be'))
//    assert.deepEqual(spy.getCall(1).args[0], Buffer.from('binary data'))
//    assert.deepEqual(spy.getCall(2).args[0], Buffer.from('sent from a Moteino'))
//  })
//
//  it('accepts single byte delimiter', () => {
//    const data = Buffer.from('This could be\0binary data\0sent from a Moteino\0')
//    const parser = new DelimiterParser({ delimiter: [0] })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(data)
//    assert.equal(spy.callCount, 3)
//  })
//
//  it('Works when buffer starts with delimiter', () => {
//    const data = Buffer.from('\0Hello\0World\0')
//    const parser = new DelimiterParser({ delimiter: Buffer.from([0]) })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(data)
//    assert.equal(spy.callCount, 2)
//  })
//
//  it('should only emit if delimiters are strictly in row', () => {
//    const data = Buffer.from('\0Hello\u0001World\0\0\u0001')
//    const parser = new DelimiterParser({ delimiter: [0, 1] })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(data)
//    assert.equal(spy.callCount, 1)
//  })
//
//  it('continues looking for delimiters in the next buffers', () => {
//    const parser = new DelimiterParser({ delimiter: [0, 0] })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(Buffer.from('This could be\0\0binary '))
//    parser.write(Buffer.from('data\0\0sent from a Moteino\0\0'))
//    assert.equal(spy.callCount, 3)
//    assert.deepEqual(spy.getCall(0).args[0], Buffer.from('This could be'))
//    assert.deepEqual(spy.getCall(1).args[0], Buffer.from('binary data'))
//    assert.deepEqual(spy.getCall(2).args[0], Buffer.from('sent from a Moteino'))
//  })
//
//  it('works if a multibyte delimiter crosses a chunk boundary', () => {
//    const parser = new DelimiterParser({ delimiter: Buffer.from([0, 1]) })
//    const spy = sinon.spy()
//    parser.on('data', spy)
//    parser.write(Buffer.from([1, 2, 3, 0]))
//    parser.write(Buffer.from([1, 2, 3, 0]))
//    parser.write(Buffer.from([1]))
//    assert.equal(spy.callCount, 2)
//    assert.deepEqual(spy.getCall(0).args[0], Buffer.from([1, 2, 3]))
//    assert.deepEqual(spy.getCall(1).args[0], Buffer.from([2, 3]))
//  })
})
