import moment             from 'moment'

import {
  ScaleCodes as sc,
  ScaleCommands ,
  ScaleMessages,
}                        from '../scales'

const getScaleDetails = ({address, serialBus}) => {
  serialBus.push(ScaleCommands.getCapacity(address))
  serialBus.push(ScaleCommands.getCalibrationValue(address))
  serialBus.push(ScaleCommands.getRevision(address))
  serialBus.push(ScaleCommands.getCounts(address))
  serialBus.push(ScaleCommands.getSeed(address))
  serialBus.push(ScaleCommands.getGraduationSize(address))
  serialBus.push(ScaleCommands.getUniqueID(address))
}

export const messageHandler = ({
  serialBus,
  dispatch,
  data,
  measurementRead
}) => {
  const readingTime = moment()
  const message = ScaleMessages.fromBytes(data)

  let cmd = message.command
  if (cmd === '?')
    cmd = 'x'

  dispatch({
    type: 'messageReceived',
    payload: {
      message,
      readingTime,
    }
  });

  const responseHandlers = {
    ['x']         : () => {
      //check if get-addresses response or
      //get unique id response
      //cause the '?' command code is used for both
      if (
        //'addr'
        message.address ==
        ScaleMessages.encodeAddress([0x61, 0x64, 0x64, 0x72])
      ) {
        dispatch({
          type: 'scales/scaleConnected',
          payload: {
            address: message.data,
          },
        })

        getScaleDetails({
          serialBus,
          dispatch,
          address: message.data,
        })

        let getWeightInterval = setInterval(()=>{
          serialBus.push(
                ScaleCommands.getWeight(message.data)
          )
        }, 1000)
      }
      else {
        dispatch({
          type: 'scales/uniqueIDRead',
          payload: {
            address          : message.address,
            uniqueID : message.data,
            readingTime
          },
        })
      }

    },
    [sc.GET_CAPACITY_RESP]          : () => {
      dispatch({
        type: 'scales/capacityRead',
        payload: {
          address  : message.address,
          capacity : message.data,
          readingTime
        },
      })
    },

    [sc.GET_CALIBRATION_VALUE_RESP] : () => {
      dispatch({
        type: 'scales/calibrationRead',
        payload: {
          address          : message.address,
          calibrationValue : message.data,
          readingTime
        },
      })
    },

    [sc.GET_REVISION_RESP]          : () => {
      dispatch({
        type: 'scales/revisionRead',
        payload: {
          address  : message.address,
          revision : message.data,
          readingTime
        },
      })
    },
    [sc.GET_WEIGHT_RESP]            : () => {
      dispatch({
        type: 'scales/measurementRead',
        payload: {
          address     : message.address,
          measurement : message.data,
          readingTime
        }
      })

      measurementRead(message)
    },
    [sc.GET_COUNTS_RESP]            : () => {
      dispatch({
        type: 'scales/countsRead',
        payload: {
          address  : message.address,
          counts   : message.data,
          readingTime
        },
      })
    },
    [sc.GET_SEED_RESP]              : () => {
      dispatch({
        type: 'scales/seedRead',
        payload: {
          address  : message.address,
          seed     : message.data,
          readingTime
        },
      })
    },
    [sc.GET_GRAD_SIZE_RESP]         : () => {
      dispatch({
        type: 'scales/graduationSizeRead',
        payload: {
          address        : message.address,
          graduationSize : message.data,
          readingTime
        },
      })
    },
    [sc.GET_UNIQUE_ID_RESP]         : () => {
      dispatch({
        type: 'scales/uniqueIDRead',
        payload: {
          address  : message.address,
          uniqueID : message.data,
          readingTime
        },
      })
    },
  };
  if (responseHandlers[cmd]) responseHandlers[cmd]();
}

