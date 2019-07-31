import React, { useReducer }  from 'react'
import blessed              from 'neo-blessed'
import { render }           from 'react-blessed'

import telnet             from 'telnet2'

import SerialPort         from 'serialport'
import axios              from 'axios'
import moment             from 'moment'

import * as ScaleCodes    from './scaleCodes'
import * as ScaleCommands from './scaleCommands'
import * as ScaleMessages from './scaleMessages'

import Context           from './Context'
import ConnectionForm    from './ConnectionForm'
import MessageList       from './MessageList'
import MessageDetails    from './MessageDetails'
import ConnectedScales   from './ConnectedScales'
import ScaleDetails      from './ScaleDetails'

import stylesheet        from './styles'

const WEIGHUP_SCALE_DEVICE_PATH = process.env.WEIGHUP_SCALE_DEVICE_PATH
const WEIGHUP_API_URL           = process.env.WEIGHUP_API_URL
const WEIGHUP_HUB_ID            = process.env.WEIGHUP_HUB_ID

const screen = blessed.screen({
  smartCSR: true,
  title: 'WeighUp Scale Manager'
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})


const connectSerialPort = (path, onData) => {
  const port = new SerialPort(path, {baudRate: 1228800})
  port.on('data', onData)

  return port
}

const initialState = {
  scaleMessages   : [
    {
      message: ScaleMessages.fromBytes(Buffer.from([0xAA, 0xE8, 0x00, 0x00, 0x08, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x55])),
      readingTime: moment(),

    },
    {
      message: ScaleMessages.fromBytes(Buffer.from([0xAA, 0xE8, 0x00, 0x00, 0x08, 0x02, 0xC1, 0x11, 0x72, 0x14, 0x00, 0x00, 0x00, 0x00, 0x55])),
      readingTime: moment(),
    },
  ],
  selectedMessage : null,
  connectedScales : {
    0: { address: 0, serialNo: 0x0012013C },
    1: { address: 1, serialNo: 0x10073A91 },
    2: { address: 2, serialNo: 0x000FC300 },
  },
  selectedScale   : null,
  devicePath      : null,
  port            : null,
}

const reducer = (state, {type, payload}) => {
  switch(type) {
    case 'setDevicePath':
      return {...state, ...payload}
    case 'portConnected':
      return {...state, ...payload}
    case 'portDisconnected':
      return {...state, port: null}
    case 'scaleConnected':
      return {
        ...state,
        connectedScales: {
          ...state.connectedScales,
          [payload.address]: payload,
        }
      }
    case 'dropScaleList':
      return {...state, connectedScales: []}
    case 'scaleSelected':
      return {...state, ...payload}
    case 'messageReceived':
      return {
        ...state,
        scaleMessages: [
          ...state.scaleMessages,
          payload,
        ],
      }
    case 'messageSelected':
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

const App = () => {
    let [state, dispatch] = useReducer(reducer, initialState)

    let {port, scaleMessages, devicePath} = state

    return (

    <Context.Provider value={[state, dispatch]}>
  <element
    top="0%"
    left="0%"
    width="100%"
    height="100%"
    class={stylesheet.bordered}
  >
        <ConnectionForm
          connected={port}
          onSubmit={
            formData => {

              if(!port && devicePath) {
                port = connectSerialPort(
                  devicePath,
                  data => {
                    const message = ScaleMessages.fromBytes(data)
                    dispatch({
                      type: 'messageReceived',
                      payload: {
                        message,
                        readingTime: moment(),
                      }
                    })
                    if (message.opCode == ScaleCodes.CMSG_I_AM) {
                      dispatch({
                        type: 'scaleConnected',
                        payload: {
                          address: message.address,
                          serialNo: message.payload.slice(2,6).readUInt32BE(),
                        },
                      })
                    }
                  }
                )

                dispatch({type: 'portConnected', payload: {port}})
              }
            }
          }

          onDisconnect={() => {
            port.close()
            dispatch({type: 'portDisconnected'})
          }}
        />
        <MessageList />
        <MessageDetails />
        <ConnectedScales />
        <ScaleDetails />


  </element>
    </Context.Provider>
  )
}

//render(<App />, screen)

telnet({ tty: true }, function(client) {
  client.on('term', function(terminal) {
    screen.terminal = terminal;
    render(<App />, screen);
  });

  client.on('size', function(width, height) {
    client.columns = width;
    client.rows = height;
    client.emit('resize');
  });

  var screen = blessed.screen({
    smartCSR: true,
    input: client,
    output: client,
    terminal: 'xterm-256color',
    fullUnicode: true
  });

  client.on('close', function() {
    if (!screen.destroyed) {
      screen.destroy();
    }
  });

  screen.key(['C-c', 'q'], function(ch, key) {
    screen.destroy();
  });

  screen.on('destroy', function() {
    if (client.writable) {
      client.destroy();
    }
  });


}).listen(2300);

//const port = new SerialPort(WEIGHUP_SCALE_DEVICE_PATH, {baudRate: 1228800})
//
//port.on('data', serialData => {
//
//  console.log(`
//****data received from serial port****
//raw data:    : 0x${serialData.toString('hex')}
//  `)
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
////port.write(
////  scaleMessages.toBytes(
////    scaleCommands.reboot()
////  )
////)
//
//
//port.write(
//  scaleMessages.toBytes(
//    scaleCommands.identify()
//  )
//)
//
//
//port.write(
//  scaleMessages.toBytes(
//    scaleCommands.setZero(0, 0x0001f38e)
//  )
//)
//
//  port.write(
//    scaleMessages.toBytes(
//      scaleCommands.tare(0, 0x0003)
//    )
//  )
//
//
//port.write(
//  scaleMessages.toBytes(
//    scaleCommands.setScale(0, 0.00191)
//  )
//)
//
////port.write(
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
//  port.write(
//    scaleMessages.toBytes(scaleCommands.measure(0x0))
//  )
//
//  measureLoop()
//}, 400)
//}
//
//measureLoop()
