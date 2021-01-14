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

export const init = ({
  devicePath,
  measurementRead,
  serialInterval,
  scaleInterval
}) => {
  const serialBus = _serialBus({
    serialInterval,
    scaleInterval,
    send: message => {
      serialPort.write(
          Buffer.from(
            ScaleMessages.toBytes(message)
          )
      )

      log.info('message sent from bus to', message.address)

      store.dispatch({
        type: 'messageSent',
        payload: {
          message
        }
      })
    }
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
        }, 2000)
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
      log.info('message received from scale:', ScaleMessages.fromBytes(data))

      messageHandler({
        dispatch : store.dispatch,
        serialBus,
        data,
        measurementRead
      })
    }
  )

  return { serialPort, serialBus }
}

export default init
