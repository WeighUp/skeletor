import React, {
  useReducer,
  useMemo
}                         from 'react'


import SerialPort         from 'serialport'
import Delimiter from '@serialport/parser-delimiter'
import Regex from '@serialport/parser-regex'

import axios              from 'axios'
import moment             from 'moment'

import {
  ScaleCodes,
  ScaleCommands ,
  ScaleMessages,
  ConnectedScales,
  ScaleDetails,
}                        from '../scales'

import {
  messageHandler,
  MessageList,
  MessageDetails,
}                        from '../messages'

import Context           from '../Context'
import {reducer, initialState} from './reducer'

import ConnectionForm    from '../ConnectionForm'

import stylesheet        from '../styles'

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
                    messageHandler({
                      dispatch,
                      serialPort,
                      data,
                    })
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
