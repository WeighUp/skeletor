import { Transform } from 'stream'

/**
 * A transform stream that emits data each time a byte sequence is received.
 * @extends Transform
 * @summary To use the `Delimiter` parser, provide a delimiter as a string, buffer, or array of bytes. Runs in O(n) time.
 * @example
const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')
const port = new SerialPort('/dev/tty-usbserial1')
const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
parser.on('data', console.log)
 */
export class FairbanksParser extends Transform {
  constructor(options = {}) {
    super(options)


    if (options?.delimiter?.length === 0) {
      throw new TypeError('"delimiter" has a 0 or undefined length')
    }

    this.includeDelimiter = options?.includeDelimiter !== undefined ? options.includeDelimiter : true
    this.delimiter = Buffer.from(options.delimiter || '>')
    this.buffer = Buffer.alloc(0)
  }

  _transform(chunk, encoding, cb) {
    log.debug('chunk received from serial', chunk)
    let data = Buffer.concat([this.buffer, chunk])
    log.debug('buffered serial data', data)
    let position
    let offset = 0
    while ((position = data.indexOf(this.delimiter, offset)) !== -1) {
      //if position of delimiter is at the message length
      if (position === (data[1] + 1)) {
        this.push(data.slice(0, position + (this.includeDelimiter ? this.delimiter.length : 0)))
        data = data.slice(position + this.delimiter.length)
      }
      else if (data.length >= 32) {
        log.warn('flushing buffer - overflow')
        data = Buffer.alloc(0)
      }
      else if (data[0] != 0x3c || data.length > data[1]) {
        log.warn('corrupted message!')
        data = Buffer.alloc(0)
      }
      else { offset = position }
    }
    this.buffer = data
    cb()
  }

  _flush(cb) {
    this.push(this.buffer)
    this.buffer = Buffer.alloc(0)
    cb()
  }
}

export default FairbanksParser
