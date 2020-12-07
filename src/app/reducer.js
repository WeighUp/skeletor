import combineReducers from 'react-combine-reducers'

const MEASUREMENT_LIMIT = 50
const MESSAGE_LIMIT     = 50

const newScale = {
  address : '',
  measurements: [],
  capacity: 0,
  calibrationValue : 0,
  revision : 0,
  counts : 0,
  seed : 0,
  graduationSize : 0,
  uniqueID: 0,
}

const defaultState = {
  scales : {
    connectedScales       : {},
    selectedScale         : null,
  },
  scaleMessages: {
    incoming : [],
    outgoing : [],
    selectedMessage     : null,
  },
  serialConnection : {
    devicePath            : null,
    serialPort            : null,
  }
}

const scales = (scales, {type, payload}) => {
  switch(type) {
    case 'scaleConnected':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address]: {...newScale, ...payload},
        }
      }
    case 'dropScaleList':
      return {...scales, connectedScales: {}, selectedScale: null}
    case 'scaleSelected':
      return {...scales, ...payload}
    case 'measurementRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            measurements: [
              ...scales.connectedScales[payload.address].measurements,
              {
                measurement: payload.measurement,
                readingTime: payload.readingTime
              }
            ].slice(-MEASUREMENT_LIMIT)
          }
        }
      }
    case 'capacityRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            capacity: payload.capacity,
          }
        }
      }

    case 'calibrationRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            calibrationValue: payload.calibrationValue,
          }
        }
      }

    case 'revisionRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            revision: payload.revision,
          }
        }
      }

    case 'countsRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            counts: payload.counts,
          }
        }
      }

    case 'seedRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            seed: payload.seed,
          }
        }
      }

    case 'graduationSizeRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            graduationSize: payload.graduationSize,
          }
        }
      }

    case 'uniqueIDRead':
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address] : {
            ...scales.connectedScales[payload.address],
            uniqueID: payload.uniqueID,
          }
        }
      }

    default:
      return scales
  }
}

const scaleMessages = (state = {}, {type, payload}) => {
  switch(type) {
    case 'messageReceived':
      return {
        ...state,
        incoming: [
          ...state.incoming,
          payload,
        ].slice(-MESSAGE_LIMIT),
      }
    case 'messageSent':
      return {
        ...state,
        outgoing: [
          ...state.outgoing,
          payload,
        ].slice(-MESSAGE_LIMIT),
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

const serialConnection = (state = {}, {type, payload}) => {
  switch(type) {
    case 'setDevicePath':
      return {...state, ...payload}
    case 'serialPortConnected':
      return {...state, ...payload}
    case 'serialPortDisconnected':
      return {...state, serialPort: null}
    default:
      return state
  }
}

export const [reducer, initialState] = combineReducers({
  scales           : [scales, defaultState.scales],
  scaleMessages    : [scaleMessages, defaultState.scaleMessages],
  serialConnection : [serialConnection, defaultState.serialConnection]
})

export default [reducer, initialState]
