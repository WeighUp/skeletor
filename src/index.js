import SerialPort from 'serialport'

import * as ScaleCodes from './scaleCodes'

const port = new SerialPort('/dev/ttyUSB0', {baudRate: 1228800})

port.on('data', serialData => {
  const messagePrefix  = serialData.slice(0,2),
        [
          errorStatus,
          opCode,
          address,
        ]              = serialData.slice(3, 6),
        payload        = serialData.slice(6,13)

  console.log(`
****data received from serial port****
    raw data: ${data.toString('hex')}
    error: ${error}
    opcode: ${opCode}
    address: ${address}
    payload: ${payload}
  `)


})
