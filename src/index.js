import SerialPort         from 'serialport'
import axios              from 'axios'
import moment             from 'moment'

import * as scaleCodes    from './scaleCodes'
import * as scaleCommands from './scaleCommands'
import * as scaleMessages from './scaleMessages'

const WEIGHUP_SCALE_DEVICE_PATH = process.env.WEIGHUP_SCALE_DEVICE_PATH
const WEIGHUP_API_URL           = process.env.WEIGHUP_API_URL
const WEIGHUP_HUB_ID            = process.env.WEIGHUP_HUB_ID

const port = new SerialPort(WEIGHUP_SCALE_DEVICE_PATH, {baudRate: 1228800})

port.on('data', serialData => {

  console.log(`
****data received from serial port****
raw data:    : 0x${serialData.toString('hex')}
  `)

  const message = scaleMessages.fromBytes(serialData)
  scaleMessages.log(message)

  if (message.opCode === scaleCodes.CMSG_MEAS) {
    axios.post(`${WEIGHUP_API_URL}measurements.json`,{
      hub_id: WEIGHUP_HUB_ID,
      scale_id: 1,
      weight: message.payload.slice(0,4).readFloatBE() > 0 ? message.payload.slice(0,4).readFloatBE() : 0,
      //reading_time: moment().format("ddd MMM DD HH:mm:ss ZZ YYYY")
      reading_time: moment().format("YYYY-MMM-DD HH:mm:ss")
    } )
      .catch(error => {
        console.log(error)
      })
  }
})

//port.write(
//  scaleMessages.toBytes(
//    scaleCommands.reboot()
//  )
//)


port.write(
  scaleMessages.toBytes(
    scaleCommands.identify()
  )
)


port.write(
  scaleMessages.toBytes(
    scaleCommands.setZero(0, 0x0001f38e)
  )
)

  port.write(
    scaleMessages.toBytes(
      scaleCommands.tare(0, 0x0003)
    )
  )


port.write(
  scaleMessages.toBytes(
    scaleCommands.setScale(0, 0.00191)
  )
)

//port.write(
//  scaleMessages.toBytes(
//    scaleCommands.setZero(0, 0)
//  )
//)


const measureLoop = () => {
setTimeout(() => {
  console.log('measure!')

  port.write(
    scaleMessages.toBytes(scaleCommands.measure(0x0))
  )

  measureLoop()
}, 400)
}

measureLoop()
