import React, {
  useState
}                         from 'react'

import {
  useSelector,
  useDispatch
}                         from 'react-redux/lib/alternate-renderers'



import axios              from 'axios'
import moment             from 'moment'

import connectSerialPort  from '../serial'

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

import store             from './reducer'
import ErrorBoundary     from './ErrorBoundary'

import ConnectionForm    from '../ConnectionForm'

import stylesheet        from '../styles'


const App = () => {

  let {
      serialConnection : {
      serialPort,
      devicePath,
    },
    scales : { connectedScales },
    scaleMessages
  } = useSelector(state => ({...state}))

  const dispatch = useDispatch()
  const [state, setState] = useState(null)

  return (
    <ErrorBoundary>
      <box
        top="0%"
        left="0%"
        width="100%"
        height="100%"
        //class{stylesheet.bordered}
      >
        <ConnectionForm
          width="100%"
          height={4}
          connected={serialPort}
          onSubmit={
            formData => {
              setState({})
              if(!serialPort && devicePath) {
                serialPort = connectSerialPort(
                  devicePath,
                  err => {
                    serialPort.write(
                      Buffer.from(
                        ScaleMessages.toBytes(
                          ScaleCommands.getAddresses()
                        )
                      )
                    )
                  },

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
            items={scaleMessages.incoming.map((msg, index) => `${index} - ${ScaleMessages.toBytes(msg.message).map(el => el.toString(16))}`)}
            onSelect={(msg, index) => dispatch({type: 'messageSelected', payload: {selectedMessage: scaleMessages[index]}})}
          />

          <MessageList label="Outgoing Messages"
            top="65%"
            height="35%"
            width="50%"
            items={scaleMessages.outgoing.map((msg, index) => `${index} - ${ScaleMessages.toBytes(msg.message).map(el => el.toString(16))}`)}
            onSelect={(msg, index) => dispatch({type: 'messageSelected', payload: {selectedMessage: scaleMessages[index]}})}
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
    </ErrorBoundary>
  )
};

export default App
