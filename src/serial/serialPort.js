import SerialPort  from 'serialport'
import Delimiter   from '@serialport/parser-delimiter'

const connectSerialPort = (path, onConnect, onData) => {
  const serialPort = new SerialPort(
    path,
    {baudRate: 9600},
    err => {
      if (err) {
        return log.error('Error: ', err.message)
      }

      log.info('serialPort connected:', serialPort)
      serialPort.flush(error => {
        if(error) { log.info('error flushing serial port', error.message) }
        onConnect(err)
      })
    }
  )

  const parser = serialPort.pipe(
    new Delimiter({
      delimiter: '>',
      includeDelimiter : true
    })
  )

  parser.on('data',
    data => {
      log.info('data received from serial port:', data)
      onData(data)
    }
  )

  return serialPort
}

export default connectSerialPort
