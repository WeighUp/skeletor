import combineReducers from 'react-combine-reducers'

const newScale = {
  address : '',
  measurements: []
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
            measurements: [...scales.connectedScales[payload.address].measurements, {measurement: payload.measurement, readingTime: payload.readingTime}]
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
        ],
      }
    case 'messageSent':
      return {
        ...state,
        outgoing: [
          ...state.outgoing,
          payload,
        ],
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