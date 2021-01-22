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
    let data = Buffer.concat([this.buffer, chunk])
    let position
    let offset = 0
    while ((position = data.indexOf(this.delimiter, offset)) !== -1) {
      if(position === (data[1] + 1)) {
        this.push(data.slice(0, position + (this.includeDelimiter ? this.delimiter.length : 0)))
        data = data.slice(position + this.delimiter.length)
      }
      else { offset++ }
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
