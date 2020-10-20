
import SerialPort         from 'serialport'
import Delimiter from '@serialport/parser-delimiter'
import Regex from '@serialport/parser-regex'

import axios              from 'axios'
import moment             from 'moment'

import * as ScaleCodes    from './scaleCodes'
import * as ScaleCommands from './scaleCommands'
import * as ScaleMessages from './scaleMessages'

const connectSerialPort = (path, onData) => {
  //const port = new SerialPort(path, {baudRate: 1228800})
  const port = new SerialPort(path, {baudRate: 9600})
  const parser = port.pipe(new Delimiter({ delimiter: '>', includeDelimiter : true }))
  parser.on('data', onData)

  port.write(
    Buffer.from(
      ScaleMessages.toBytes(
        ScaleCommands.getAddresses()
      )
    )
  )

  return port
}

const port   = connectSerialPort('/dev/ttyUSB0', ()=> {})
//const port   = connectSerialPort(WEIGHUP_SCALE_DEVICE_PATH, ()=> {})
const parser = port.pipe(new Delimiter({ delimiter: '>', includeDelimiter : true }))

setInterval(()=>{
  port.write(
    Buffer.from(
      ScaleMessages.toBytes(
        ScaleCommands.getAddresses()
      )
    )
  )

  console.log('sent Get-Addresses command!')
}, 12000)

port.on('data', serialData => {
  console.log(`
****data received from serial port****
raw data (hex)    : 0x${serialData.toString('hex')}
raw data (utf8)    : ${serialData.toString('utf8')}
  `)
})

parser.on('data', serialData => {
  console.log(`
****message received from parser****
raw msg (hex) : 0x${serialData.toString('hex')}
raw msg       :          ${serialData}
parsed        : ${JSON.stringify(ScaleMessages.fromBytes(serialData), null, 2)}
  `)
})


