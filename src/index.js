import React, {
  useReducer,
  useMemo
}                         from 'react'
import blessed            from 'neo-blessed'
import { render }         from 'react-blessed'

import telnet             from 'telnet2'

import SerialPort         from 'serialport'
import Delimiter from '@serialport/parser-delimiter'
import Regex from '@serialport/parser-regex'

import axios              from 'axios'
import moment             from 'moment'

import * as ScaleCodes    from './scaleCodes'
import * as ScaleCommands from './scaleCommands'
import * as ScaleMessages from './scaleMessages'

import Context           from './Context'
import {reducer, initialState} from './reducer'

import ConnectionForm    from './ConnectionForm'
import MessageList       from './MessageList'
import MessageDetails    from './MessageDetails'
import ConnectedScales   from './ConnectedScales'
import ScaleDetails      from './ScaleDetails'

import stylesheet        from './styles'

const WEIGHUP_SCALE_DEVICE_PATH = process.env.WEIGHUP_SCALE_DEVICE_PATH || '/dev/ttyUSB0'
const WEIGHUP_API_URL           = process.env.WEIGHUP_API_URL
const WEIGHUP_HUB_ID            = process.env.WEIGHUP_HUB_ID

const screen = blessed.screen({
  smartCSR: true,
  title: 'WeighUp Scale Manager'
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

//parser.on('data', serialData => {

//  console.log(`
//****message received from serial serialPort****
//raw msg (hex)    : 0x${serialData.toString('hex')}
//raw msg          :          ${serialData}
//parsed            : ${JSON.stringify(ScaleMessages.fromBytes(serialData), null, 2)}
//  `)
//})

const connectSerialPort = (path, onData) => {
  //const serialPort = new SerialPort(path, {baudRate: 1228800})
  const serialPort = new SerialPort(path, {baudRate: 9600})
  const parser = serialPort.pipe(new Delimiter({ delimiter: '>', includeDelimiter : true }))
  parser.on('data', onData)

  serialPort.write(
    Buffer.from(
      ScaleMessages.toBytes(
        ScaleCommands.getAddresses()
      )
    )
  )

  return serialPort
}


const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    //const contextVal = useMemo(()=>{return [state, dispatch]}, [state, dispatch])
    let {
        serialConnection : {
        serialPort,
        devicePath,
      },
      scales : { connectedScales }
    } = state

    return (

    <Context.Provider value={[state, dispatch]}>
  <box
    top="0%"
    left="0%"
    width="100%"
    height="100%"
    //class={stylesheet.bordered}
  >
        <ConnectionForm
          width="100%"
          height={4}
          connected={serialPort}
          onSubmit={
            formData => {
              if(!serialPort && devicePath) {
                serialPort = connectSerialPort(
                  devicePath,
                  data => {
                    const readingTime = moment()

                    const message = ScaleMessages.fromBytes(data)

                    dispatch({
                      type: 'messageReceived',
                      payload: {
                        message,
                        readingTime,
                      }
                    })

                    if (message.address == ScaleMessages.encodeAddress([0x61, 0x64, 0x64, 0x72])) {
                      dispatch({
                        type: 'scaleConnected',
                        payload: {
                          address: message.data,
                        },
                      })

                      let getWeightInterval = setInterval(()=>{
                       // if (!connectedScales[message.data]) {
                       //   clearInterval(getWeightInterval)
                       //   return
                       // }

                        serialPort.write(
                          Buffer.from(
                            ScaleMessages.toBytes(
                              ScaleCommands.getWeight(message.data)
                              )
                          )
                        )

                        dispatch({
                          type: 'messageSent',
                          payload: {
                            message:
                              ScaleCommands.getWeight(message.data)
                          }
                        })
                      }, 1000)
                    }

                    if (message.command === ScaleCodes.GET_WEIGHT_RESP) {
                      dispatch({
                        type: 'measurementRead',
                        payload: {
                          address: message.address,
                          measurement: message.data,
                          readingTime
                        }
                      })
                    }
                  }
                )

                dispatch({type: 'serialPortConnected', payload: {serialPort}})
              }
            }
          }

          onDisconnect={() => {
            serialPort.close()
            dispatch({type: 'serialPortDisconnected'})
          }}
        />
        <box height="100%-3" top={3}>

        <ConnectedScales
          top={0}
          width="50%"
          height="30%"

          refreshScales={()=> {
            if(serialPort) {
              dispatch({type: 'dropScaleList'})
              serialPort.write(
                Buffer.from(
                  ScaleMessages.toBytes(
                    ScaleCommands.getAddresses()
                  )
                )
              )

              dispatch({
                type: 'messageSent',
                payload: {
                  message: 
                    ScaleCommands.getAddresses()
                }
              })
            }
          }}
        />
        <MessageList label="Incoming Messages"
      top="30%"
      height="35%"
      width="50%"
      items={state.scaleMessages.incoming.map((msg, index) => `${index} - ${ScaleMessages.toBytes(msg.message).map(el => el.toString(16))}`)}
      onSelect={(msg, index) => dispatch({type: 'messageSelected', payload: {selectedMessage: state.scaleMessages[index]}})}
        />
        <MessageList label="Outgoing Messages"
          top="65%"
          height="35%"
          width="50%"
    items={state.scaleMessages.outgoing.map((msg, index) => `${index} - ${ScaleMessages.toBytes(msg.message).map(el => el.toString(16))}`)}
    onSelect={(msg, index) => dispatch({type: 'messageSelected', payload: {selectedMessage: state.scaleMessages[index]}})}
        />

        <ScaleDetails
          top={0}
          left="50%"
          height="50%"
        />
        <MessageDetails
          top="50%"
          left="50%"
          height="50%"
        />
</box>

  </box>
    </Context.Provider>
  )
}

render(<App />, screen)

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
