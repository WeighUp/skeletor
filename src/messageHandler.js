import moment             from 'moment'

import * as sc from './scaleCodes'
import * as ScaleMessages from './scaleMessages'
import * as ScaleCommands from './scaleCommands'


export const messageHandler = ({serialPort, dispatch, data}) => {
  const readingTime = moment()
  const message = ScaleMessages.fromBytes(data)
 
  if (message.command === '?')
    message.command = 'x'

  dispatch({
    type: 'messageReceived',
    payload: {
      message,
      readingTime,
    }
  });

  const responseHandlers = {
    ['x']         : () => {
      //check to make sure it's actually a get-address response
      //cause the '?' command code is sketchy
      if (
        message.address ==
        ScaleMessages.encodeAddress([0x61, 0x64, 0x64, 0x72])
      ) {
        dispatch({
          type: 'scaleConnected',
          payload: {
            address: message.data,
          },
        })
  
        let getWeightInterval = setInterval(()=>{
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

          serialPort.write(
            Buffer.from(
              ScaleMessages.toBytes(
                ScaleCommands.getCapacity(message.data)
                )
            )
          )

          dispatch({
            type: 'messageSent',
            payload: {
              message:
                ScaleCommands.getCapacity(message.data)
            }
          })
        }, 1000)
      }

    },
    [sc.GET_CAPACITY_RESP]          : () => {
      dispatch({
        type: 'capacityRead',
        payload: {
          address  : message.address,
          capacity : message.data,
          readingTime
        },
      })
    },

    [sc.GET_CALIBRATION_VALUE_RESP] : () => {
    },

    [sc.GET_REVISION_RESP]          : () => {},
    [sc.GET_WEIGHT_RESP]            : () => {
      dispatch({
        type: 'measurementRead',
        payload: {
          address: message.address,
          measurement: message.data,
          readingTime
        }
      })
    },
    [sc.GET_COUNTS_RESP]            : () => {},
    [sc.GET_SEED_RESP]              : () => {},
    [sc.GET_GRAD_SIZE_RESP]         : () => {},
    [sc.GET_UNIQUE_ID_RESP]         : () => {},
  };
  if (responseHandlers[message.command]) responseHandlers[message.command]();
  //console.log('handler', message.command, fuckyou[message.command], fuckyou)
}
