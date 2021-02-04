import * as conf          from './config'

import blessed            from 'blessed'
import { render }         from 'react-blessed'

import React              from 'react'

import { Provider }       from 'react-redux/lib/alternate-renderers'
//import telnet             from 'telnet2'


import axios              from 'axios'
import moment             from 'moment'

import log from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

import App, {
  store,
  ErrorBoundary,
  init
}                         from './app'

//use loglevel logger throughout app
global.log = log
prefix.reg(log)
log.enableAll()
prefix.apply(log, {
  template: '[%t] %l:',
  levelFormatter: function (level) {
    return level.toUpperCase();
  },
  timestampFormatter: function (date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  }
})

log.debug('Config values loaded:', conf)

init({
  devicePath: conf.WEIGHUP_SCALE_DEVICE_PATH,
  measurementRead:  msg => {
    axios.post(`${conf.WEIGHUP_API_URL}/measurements.json`,{
      hub_id: conf.WEIGHUP_HUB_ID,
      scale_uuid: msg.address,
      weight: msg.data,
      //reading_time: moment().format("ddd MMM DD HH:mm:ss ZZ YYYY")
      reading_time: moment().format("YYYY-MMM-DD HH:mm:ss")
    })
    .catch(error => {
      log.error(error.message)
    })
  },
  scaleInterval: conf.WEIGHUP_SCALE_INTERVAL,
  serialInterval: conf.WEIGHUP_SERIAL_INTERVAL,
  zeroScales: conf.WEIGHUP_INIT_ZERO_SCALES,
})

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
////  log.info(`
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
//        log.info(error)
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
//log.info('wrote to serialPort')
//log.info(ScaleCommands.getAddresses())
//log.info(ScaleMessages.toBytes(ScaleCommands.getAddresses()))
///log.info(Buffer.from(ScaleMessages.toBytes(ScaleCommands.getAddresses())))

//setTimeout(() => {
//  log.info('drup')},
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
//  log.info('measure!')
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
