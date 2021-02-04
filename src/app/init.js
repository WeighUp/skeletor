import {
  useSelector,
  useDispatch
}                         from 'react-redux/lib/alternate-renderers'

import moment             from 'moment'

import connectSerialPort  from '../serial'

import { bus as _serialBus }      from '../bus'

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
  scaleInterval,
  zeroScales,
}) => {
  let sentMessageCount = 0,
      receivedMessageCount = 0

  const serialBus = _serialBus(
    message => {
      serialPort.write(
          Buffer.from(
            ScaleMessages.toBytes(message)
          )
      )

      log.info('message sent from bus to', message.address)
      log.debug('Sent messages:', ++sentMessageCount)

      store.dispatch({
        type: 'messageSent',
        payload: {
          message
        }
      })
    },
    serialInterval,
    100
  )
  serialBus.start()

  const serialPort = connectSerialPort(
    devicePath,
    err => {
      store.dispatch({type: 'serialPortConnected', payload: {serialPort}})
      Object.values(store.getState().scales.connectedScales).forEach(scale => {
        if(zeroScales) {
          serialBus.push(ScaleCommands.zeroCell(scale.address))
        }

        let getWeightInterval = setInterval(()=>{
          serialBus.push(
            ScaleCommands.getWeight(scale.address)
          )
        }, 100)
      })
    },

    data => {
      serialBus.unlock()
      log.debug('message received from scale:', ScaleMessages.fromBytes(data))
      log.debug('Received message count:', ++receivedMessageCount)

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
