import SerialPort  from 'serialport'
import Delimiter   from '@serialport/parser-delimiter'

const connectSerialPort = (path, onConnect, onData) => {
  const serialPort = new SerialPort(
    path,
    {baudRate: 9600},
    err => {
      if (err) {
        return console.error('Error: ', err.message)
      }

      console.info('serialPort connected:', serialPort)
      onConnect(err)
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
      console.info('data received from serial port:', data)
      onData(data)
    }
  )

  return serialPort
}

export default connectSerialPort
