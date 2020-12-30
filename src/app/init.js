import {
  useSelector,
  useDispatch
}                         from 'react-redux/lib/alternate-renderers'

import moment             from 'moment'

import connectSerialPort  from '../serial'

import { serialBus as _serialBus }      from '../bus'

import {
  ScaleCodes,
  ScaleCommands ,
  ScaleMessages,
}                        from '../scales'

import {
  messageHandler,
}                        from '../messages'

import store             from './reducer'

export const init = (devicePath) => {
  const serialBus = _serialBus(message => {
    serialPort.write(
        Buffer.from(
          ScaleMessages.toBytes(message)
        )
    )

    console.log('message sent from bus', message)

    store.dispatch({
      type: 'messageSent',
      payload: {
        message
      }
    })
  })
  serialBus.start()

  const serialPort = connectSerialPort(
    devicePath,
    err => {
      store.dispatch({type: 'serialPortConnected', payload: {serialPort}})
      Object.values(store.getState().scales.connectedScales).forEach(scale => {
         let getWeightInterval = setInterval(()=>{
          serialBus.push(
                ScaleCommands.getWeight(scale.address)
          )
        }, 100)
      })
     //serialPort.write(
     //   Buffer.from(
     //     ScaleMessages.toBytes(
     //       ScaleCommands.getAddresses()
     //     )
     //   )
     // )
    },

    data => {
      console.info('message received from scale:', ScaleMessages.fromBytes(data))

      messageHandler({
        dispatch : store.dispatch,
        serialBus,
        data,
      })
    }
  )

  return { serialPort, serialBus }
}

export default init
