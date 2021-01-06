import {
  configureStore,
  getDefaultMiddleware,
  createSlice
} from '@reduxjs/toolkit'

import devToolsEnhancer from 'remote-redux-devtools'

import logger from 'redux-logger'

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

const preloadedState = {
  scales : {
    connectedScales       : {
     // '00B76672' : { ...newScale, address: '00B76672' },
     // '00B79BBD' : { ...newScale, address: '00B79BBD' },
     // '00B79950' : { ...newScale, address: '00B79950' },
     // '00B796AA' : { ...newScale, address: '00B796AA' },
     // '00B72EE5' : { ...newScale, address: '00B72EE5' },
      '00B7674E' : { ...newScale, address: '00B7674E' },
      '00B73CF6' : { ...newScale, address: '00B73CF6' },
      '00B77DAE' : { ...newScale, address: '00B77DAE' },
      '00B72E24' : { ...newScale, address: '00B72E24' },
      '00B78804' : { ...newScale, address: '00B78804' },
      '00B74360' : { ...newScale, address: '00B74360' },
      '00B7541D' : { ...newScale, address: '00B7541D' },
      '00B743F3' : { ...newScale, address: '00B743F3' },
      '00B7317E' : { ...newScale, address: '00B7317E' },
      '00B788BD' : { ...newScale, address: '00B788BD' },

      '00B77677' : { ...newScale, address: '00B77677' },
      '00B79A3D' : { ...newScale, address: '00B79A3D' },
      '00B77DFB' : { ...newScale, address: '00B77DFB' },

      '00B77AA5' : { ...newScale, address: '00B77AA5' },
      '00B75879' : { ...newScale, address: '00B75879' },
      '00B77F3E' : { ...newScale, address: '00B77F3E' },
      '00B7906A' : { ...newScale, address: '00B7906A' },
      '00B727AC' : { ...newScale, address: '00B727AC' },
      '00B74EB7' : { ...newScale, address: '00B74EB7' },
      '00B79F2F' : { ...newScale, address: '00B79F2F' },
      '00B76370' : { ...newScale, address: '00B76370' },
      '00B79F57' : { ...newScale, address: '00B79F57' },
      '00B7334A' : { ...newScale, address: '00B7334A' },
      '00B79B14' : { ...newScale, address: '00B79B14' },
      '00B77ABC' : { ...newScale, address: '00B77ABC' },
      '00B72F58' : { ...newScale, address: '00B72F58' },
      '00B727BC' : { ...newScale, address: '00B727BC' },
      '00B7566E' : { ...newScale, address: '00B7566E' },
      '00B7512B' : { ...newScale, address: '00B7512B' },
      '00B7895D' : { ...newScale, address: '00B7895D' },
      '00B75618' : { ...newScale, address: '00B75618' },
      '00B7666F' : { ...newScale, address: '00B7666F' },
      '00B79CEA' : { ...newScale, address: '00B79CEA' },
      '00B72772' : { ...newScale, address: '00B72772' },
      '00B76B53' : { ...newScale, address: '00B76B53' },
      '00B775B6' : { ...newScale, address: '00B775B6' },
      '00B7338E' : { ...newScale, address: '00B7338E' },
      '00B76A8D' : { ...newScale, address: '00B76A8D' },
      '00B76227' : { ...newScale, address: '00B76227' },
      '00B73053' : { ...newScale, address: '00B73053' },
    },
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

const scales = createSlice ({
  name: 'scales',
  initialState : {},
  reducers : {
    scaleConnected(scales, {payload}) {
      return {
        ...scales,
        connectedScales: {
          ...scales.connectedScales,
          [payload.address]: {...newScale, ...payload},
        }
      }
    },
    dropScaleList(scales, {payload}) {
      return {...scales, connectedScales: {}, selectedScale: null}
    },
    scaleSelected(scales, {payload}) {
      return {...scales, ...payload}
    },
    measurementRead(scales, {payload}) {
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
    },
    capacityRead(scales, {payload}) {
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
    },

    calibrationRead(scales, {payload}) {
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
    },
    revisionRead(scales, {payload}) {
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
    },
    countsRead(scales, {payload}) {
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
    },
    seedRead(scales, {payload}) {
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
    },
    graduationSizeRead(scales, {payload}) {
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
    },
    uniqueIDRead(scales, {payload}) {
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
    }
  }
})

const scaleMessages = createSlice({
  name: 'scaleMessages',
  initialState : [],
  reducers : {
    messageReceived(state, {payload}) {
      return {
        ...state,
        incoming: [
          ...state.incoming,
          payload,
        ].slice(-MESSAGE_LIMIT),
      }
    },
    messageSent(state, {payload}) {
      return {
        ...state,
        outgoing: [
          ...state.outgoing,
          payload,
        ].slice(-MESSAGE_LIMIT),
      }
    },
    messageSelected(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  }
})

const serialConnection = createSlice({
  name         : 'serialConnection',
  initialState : {},
  reducers     : {
    setDevicePath(state, {payload}) {
      return {...state, ...payload}
    },
    serialPortConnected(state, {payload}) {
      return {...state, ...payload}
    },
    serialPortDisconnected(state, {payload}) {
      return {...state, serialPort: null}
    }
  }
})

export const store = configureStore({
  reducer: {
      scales: scales.reducer,
    scaleMessages: scaleMessages.reducer,
    serialConnection : serialConnection.reducer
  },

  middleware: (getDefaultMiddleware) =>
    //getDefaultMiddleware().concat(logger),
    [],

  devTools: false,
  enhancers: [devToolsEnhancer({port: 8999})],

  preloadedState
})

export default store
