import moment             from 'moment'

import {
  ScaleCodes as sc,
  ScaleCommands ,
  ScaleMessages,
}                        from '../scales'

const getScaleDetails = ({serialPort, dispatch, address}) => {
  const timeIncrement = 1000

  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getCapacity(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getCapacity(address)
      }
    })
  }, 1)


  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getCalibrationValue(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getCalibrationValue(address)
      }
    })
  }, timeIncrement * 1)


  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getRevision(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getRevision(address)
      }
    })
  }, timeIncrement * 2)

  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getCounts(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getCounts(address)
      }
    })
  }, timeIncrement * 3)

  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getSeed(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getSeed(address)
      }
    })
  }, timeIncrement * 4)

  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getGraduationSize(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getGraduationSize(address)
      }
    })
  }, timeIncrement * 5)

  setTimeout(() => {
    serialPort.write(
      Buffer.from(
        ScaleMessages.toBytes(
          ScaleCommands.getUniqueID(address)
          )
      )
    )

    dispatch({
      type: 'messageSent',
      payload: {
        message:
          ScaleCommands.getUniqueID(address)
      }
    })
  }, timeIncrement * 6)
}

export const messageHandler = ({serialPort, dispatch, data}) => {
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
          type: 'scaleConnected',
          payload: {
            address: message.data,
          },
        })

        getScaleDetails({
          serialPort,
          dispatch,
          address: message.data,
        })

       // let getWeightInterval = setInterval(()=>{
       //   serialPort.write(
       //     Buffer.from(
       //       ScaleMessages.toBytes(
       //         ScaleCommands.getWeight(message.data)
       //         )
       //     )
       //   )

       //   dispatch({
       //     type: 'messageSent',
       //     payload: {
       //       message:
       //         ScaleCommands.getWeight(message.data)
       //     }
       //   })

       // }, 1000)
      }
      else {
        dispatch({
          type: 'uniqueIDRead',
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
        type: 'capacityRead',
        payload: {
          address  : message.address,
          capacity : message.data,
          readingTime
        },
      })
    },

    [sc.GET_CALIBRATION_VALUE_RESP] : () => {
      dispatch({
        type: 'calibrationRead',
        payload: {
          address          : message.address,
          calibrationValue : message.data,
          readingTime
        },
      })
    },

    [sc.GET_REVISION_RESP]          : () => {
      dispatch({
        type: 'revisionRead',
        payload: {
          address  : message.address,
          revision : message.data,
          readingTime
        },
      })
    },
    [sc.GET_WEIGHT_RESP]            : () => {
      dispatch({
        type: 'measurementRead',
        payload: {
          address     : message.address,
          measurement : message.data,
          readingTime
        }
      })
    },
    [sc.GET_COUNTS_RESP]            : () => {
      dispatch({
        type: 'countsRead',
        payload: {
          address  : message.address,
          counts   : message.data,
          readingTime
        },
      })
    },
    [sc.GET_SEED_RESP]              : () => {
      dispatch({
        type: 'seedRead',
        payload: {
          address  : message.address,
          seed     : message.data,
          readingTime
        },
      })
    },
    [sc.GET_GRAD_SIZE_RESP]         : () => {
      dispatch({
        type: 'graduationSizeRead',
        payload: {
          address        : message.address,
          graduationSize : message.data,
          readingTime
        },
      })
    },
    [sc.GET_UNIQUE_ID_RESP]         : () => {
      dispatch({
        type: 'uniqueIDRead',
        payload: {
          address  : message.address,
          uniqueID : message.data,
          readingTime
        },
      })
    },
  };
  if (responseHandlers[cmd]) responseHandlers[cmd]();
  //console.log('handler', message.command, fuckyou[message.command], fuckyou)
}
