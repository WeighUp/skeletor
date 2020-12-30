import blessed            from 'blessed'
import { render }         from 'react-blessed'

import React              from 'react'

import { Provider }       from 'react-redux/lib/alternate-renderers'
//import telnet             from 'telnet2'


import axios              from 'axios'
import moment             from 'moment'

import App, {
  store,
  ErrorBoundary,
  init
}                         from './app'

const WEIGHUP_SCALE_DEVICE_PATH = process.env.WEIGHUP_SCALE_DEVICE_PATH || '/dev/ttyUSB0';
const WEIGHUP_API_URL           = process.env.WEIGHUP_API_URL || 'https://weighup-api-development.herokuapp.com/api/v1'
const WEIGHUP_HUB_ID            = process.env.WEIGHUP_HUB_ID || 1;

init(
  WEIGHUP_SCALE_DEVICE_PATH,
  msg => {
    axios.post(`${WEIGHUP_API_URL}/measurements.json`,{
      hub_id: WEIGHUP_HUB_ID,
      scale_uuid: msg.address,
      weight: msg.data,
      //reading_time: moment().format("ddd MMM DD HH:mm:ss ZZ YYYY")
      reading_time: moment().format("YYYY-MMM-DD HH:mm:ss")
    })
    .catch(error => {
      console.error(error)
    })
  }
)

//const screen = blessed.screen({
//  smartCSR: true,
//  title: 'WeighUp Scale Manager'
//});
//
//screen.key(['escape', 'q', 'C-c'], function(ch, key) {
//  return process.exit(0);
//});
//
////parser.on('data', serialData => {
//
////  console.log(`
////****message received from serial serialPort****
////raw msg (hex)    : 0x${serialData.toString('hex')}
////raw msg          :          ${serialData}
////parsed            : ${JSON.stringify(ScaleMessages.fromBytes(serialData), null, 2)}
////  `)
////})
//
//
//
//
//render(
//  <Provider store={store}>
//    <ErrorBoundary>
//    <App />
//    </ErrorBoundary>
//  </Provider>,
//  screen
//);

//telnet({ tty: true }, function(client) {
//  client.on('term', function(terminal) {
//    screen.terminal = terminal;
//    render(<App />, screen);
//  });
//
//  client.on('size', function(width, height) {
//    client.columns = width;
//    client.rows = height;
//    client.emit('resize');
//  });
//
//  var screen = blessed.screen({
//    smartCSR: true,
//    input: client,
//    output: client,
//    terminal: 'xterm-256color',
//    fullUnicode: true
//  });
//
//  client.on('close', function() {
//    if (!screen.destroyed) {
//      screen.destroy();
//    }
//  });
//
//  screen.key(['C-c', 'q'], function(ch, key) {
//    screen.destroy();
//  });
//
//  screen.on('destroy', function() {
//    if (client.writable) {
//      client.destroy();
//    }
//  });
//
//
//}).listen(2300);

//const serialPort = new SerialPort(WEIGHUP_SCALE_DEVICE_PATH, {baudRate: 9600})
//const parser = serialPort.pipe(new Delimiter({ delimiter: '>', includeDelimiter : true }))


//
//  const message = scaleMessages.fromBytes(serialData)
//  scaleMessages.log(message)
//
//  if (message.opCode === scaleCodes.CMSG_MEAS) {
//    axios.post(`${WEIGHUP_API_URL}measurements.json`,{
//      hub_id: WEIGHUP_HUB_ID,
//      scale_id: 1,
//      weight: message.payload.slice(0,4).readFloatBE() > 0 ? message.payload.slice(0,4).readFloatBE() : 0,
//      //reading_time: moment().format("ddd MMM DD HH:mm:ss ZZ YYYY")
//      reading_time: moment().format("YYYY-MMM-DD HH:mm:ss")
//    } )
//      .catch(error => {
//        console.log(error)
//      })
//  }
//})
//
////serialPort.write(
////  scaleMessages.toBytes(
////    scaleCommands.reboot()
////  )
////)
//
//



//serialPort.write(
//  Buffer.from(
//    ScaleMessages.toBytes(
//      ScaleCommands.getAddresses()
//    )
//  )
//)
//console.log('wrote to serialPort')
//console.log(ScaleCommands.getAddresses())
//console.log(ScaleMessages.toBytes(ScaleCommands.getAddresses()))
///console.log(Buffer.from(ScaleMessages.toBytes(ScaleCommands.getAddresses())))

//setTimeout(() => {
//  console.log('drup')},
// 15000
//)
//
//
//serialPort.write(
//  scaleMessages.toBytes(
//    scaleCommands.setZero(0, 0x0001f38e)
//  )
//)
//
//  serialPort.write(
//    scaleMessages.toBytes(
//      scaleCommands.tare(0, 0x0003)
//    )
//  )
//
//
//serialPort.write(
//  scaleMessages.toBytes(
//    scaleCommands.setScale(0, 0.00191)
//  )
//)
//
////serialPort.write(
////  scaleMessages.toBytes(
////    scaleCommands.setZero(0, 0)
////  )
////)
//
//
//const measureLoop = () => {
//setTimeout(() => {
//  console.log('measure!')
//
//  serialPort.write(
//    scaleMessages.toBytes(scaleCommands.measure(0x0))
//  )
//
//  measureLoop()
//}, 400)
//}
//
//measureLoop()
