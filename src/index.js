import SerialPort from 'serialport'

import * as ScaleCodes from './scaleCodes'

const WEIGHUP_SCALE_DEVICE_PATH = process.env.WEIGHUP_SCALE_DEVICE_PATH
const WEIGHUP_API_URL           = process.env.WEIGHUP_API_URL
const WEIGHUP_HUB_ID            = process.env.WEIGHUP_HUB_ID

const port = new SerialPort(WEIGHUP_SCALE_DEVICE_PATH, {baudRate: 1228800})


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

    axios.post(`${WEIGHUP_API_URL}measurements.json`,{
      hub_id: WEIGHUP_HUB_ID,
      scale_id: 1,
      weight: message.payload.slice(0,4)[0] > 0 ? message.payload.slice(0,4)[0] : 0,
      //reading_time: moment().format("ddd MMM DD HH:mm:ss ZZ YYYY")
      reading_time: moment().format("YYYY-MMM-DD HH:mm:ss")
    })
    .catch(error => {
      console.log(error)
    })


})
