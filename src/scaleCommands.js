import * as ScaleCodes from './scaleCodes'

export const scaleCommandTemplate = {
  prefix      : ScaleCodes.EXTD_MSG,
  msidParam   : ScaleCodes.NO_VALUE,
  errorStatus : ScaleCodes.NO_ERROR,
  opCode      : ScaleCodes.CCMD_IDENTIFY,
  address     : ScaleCodes.ADDR_ALL,
  payload     : [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,],
  term        : ScaleCodes.TERM,
}


  // set an address
export const youAre = (address = 0, newAddress, serialNumber = 0xFFFFFFFF) => {
 const _serialNumber = Buffer.alloc(4)
  _serialNumber.writeUInt32BE(serialNumber)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_YOU_ARE,
    address,
    payload: [
      0x00,
      newAddress,
      ..._serialNumber,
      0x00,
      0x00,
    ]
  }
}

export const identify = (address = 0, serialNumber = 0x00000000) => {
  const _serialNumber = Buffer.alloc(4)
  _serialNumber.writeUInt32BE(serialNumber)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_IDENTIFY,
    address,
    payload: [
      0x00,
      address,
      ..._serialNumber,
      0x00,
      0x00,
    ]
  }
}

export const setSerial = (address = 0, serialNumber) => {
  const _serialNumber = Buffer.alloc(4)
  _serialNumber.writeUInt32BE(serialNumber)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_SET_SERIAL,
    address,
    payload: [
      0x00,
      address,
      ..._serialNumber,
      0x00,
      0x00,
    ]
  }
}

export const tare = (address = 0, average_ms = 0x0000) => {
  const _average_ms = Buffer.alloc(2)
  _average_ms.writeUInt16BE(average_ms)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_TARE,
    address,
    payload: [
      ..._average_ms,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
    ]
  }
}

export const scale = (address = 0, weight) => {
  const _weight = Buffer.alloc(4)
  _weight.writeFloatBE(weight)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_SCALE,
    address,
    payload: [
      ..._weight,
      0x00,
      0x00,
      0x00,
      0x00,
    ]
  }
}

export const writeFlash = (address = 0, serialNumber) => {
  const _serialNumber = Buffer.alloc(4)
  _serialNumber.writeUInt32BE(serialNumber)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_WR_FLSH,
    address,
    payload: [
      0x00,
      address,
      ..._serialNumber,
      0x00,
      0x00,
    ]
  }
}

export const reboot = (address = 0) => {
  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_REBOOT,
    address,
  }
}

export const measure = (address = 0) => {
  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_MEAS,
    address,
  }
}

export const getTemp = (address = 0) => {
  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_GET_TEMP,
    address,
  }
}

export const setZero = (address = 0, zeroADCCount = 0) => {
  const _zeroADCCount = Buffer.alloc(4)
  _zeroADCCount.writeUInt32BE(zeroADCCount)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_SETZERO,
    address,
    payload: [
      ..._zeroADCCount,
      0x00,
      0x00,
      0x00,
      0x00,
    ]
  }
}

export const setScale = (address = 0, scaleFactor) => {
  const _scaleFactor = Buffer.alloc(4)
  _scaleFactor.writeFloatBE(scaleFactor)

  return {
    ...scaleCommandTemplate,
    opCode: ScaleCodes.CCMD_SETSCALE,
    address,
    payload: [
      ..._scaleFactor,
      0x00,
      0x00,
      0x00,
      0x00,
    ]
  }
}


