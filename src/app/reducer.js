import {
  configureStore,
  getDefaultMiddleware,
  createSlice
} from '@reduxjs/toolkit'

import devToolsEnhancer from 'remote-redux-devtools'

import logger from 'redux-logger'

import * as fs from 'fs'
import {resolve} from 'path'

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

let connectedScales = JSON.parse(
  fs.readFileSync(
    process.env.WEIGHUP_CONNECTED_SCALES_FILE
    //resolve(__dirname, process.env.WEIGHUP_CONNECTED_SCALES_FILE)
  )
)

connectedScales = connectedScales.reduce(
  (scales, address) => ({
    ...scales, [address]: {...newScale, address}
  }),
  {}
)

const preloadedState = {
  scales : {
    connectedScales,
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
              ...scales.connectedScales[payload.address]?.measurements,
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
