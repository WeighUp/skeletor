import * as scaleCodes from './scaleCodes'

export const toBytes = (message) => {

  const prefix = Buffer.alloc(2)
  prefix.writeUInt16BE(message.prefix)

  return Buffer.from([
    ...prefix,
    message.msidParam,
    message.errorStatus,
    message.opCode,
    message.adddress,
    ...message.payload,
    message.term,
  ])
}

export const fromBytes = (serialData) => {
  const prefix  = serialData.slice(0,2),
        [
          msidParam,
          errorStatus,
          opCode,
          address,
        ]              = serialData.slice(2, 6),
        payload        = serialData.slice(6,14),
        term           = serialData[14]

  return {
    prefix,
    msidParam,
    errorStatus,
    opCode,
    address,
    payload,
    term
  }
}

export const log = ({
  prefix,
  msidParam,
  errorStatus,
  opCode,
  address,
  payload
}) => {
  console.log(`
prefix       : 0x${prefix.toString('hex')}
msidParam    : 0x${msidParam.toString(16)}
errorStatus  : 0x${errorStatus.toString(16)}
opCode       : 0x${opCode.toString(16)}/${Object.keys(scaleCodes).find(key => scaleCodes[key] === opCode)}
address      : 0x${address.toString(16)}
payload      : 0x${payload.toString('hex')}/${payload.readBigInt64BE().toString(10)}/${payload.slice(0,4).readFloatBE()}F - ${payload.slice(4).readFloatBE()}F
  `)
}
