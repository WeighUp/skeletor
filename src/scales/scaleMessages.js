import * as scaleCodes from './scaleCodes'

export const scaleMessage = ({address, command, data}) => {
//  address = encodeAddress(address)
//  data    = encodeData(data)

  //command char + checksum value + tail = 3bytes so +3
  const length = decodeAddress(address).length + data.length + 3

  return {
    prefix : scaleCodes.HEAD,
    length,
    address,
    command,
    data,
    checksum : checksum({
      length,
      address: decodeAddress(address),
      command,
      data,
    }),
    term  : scaleCodes.TAIL
  }
}

export const encodeAddress = address => (
  address.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
)

//@address (String) - string of 8 hex digits
//  representing the 4byte cell address
//  ex '002FB58C'
export const decodeAddress = address => (
  [...address].reduce((decoded, value, index, addr)=>{
    if(index % 2 === 0) {
      return [
        ...decoded,
        parseInt(
          addr.slice(index, index+2).join(''),
          16
        )
      ]
    }
    return decoded
  }, [])
)

export const encodeData = data => {
  let dec = data % 1
  if (dec)
    dec = dec.toString(16).slice(0,3)

  
    data = data.toString(16)

   return data.split('').map(char => char.charCodeAt(0))
  //let [int, dec] = data.toString().split('.')

  //int = int.map(digit => digit.charCodeAt(0))

  //if (dec) {
  //  dec = dec.toFixed(3)
  //  dec = ['.', ...dec].map(d => d.charCodeAt(0))
  //}
  //
  //return [...int, ...dec]
}

export const decodeData = data => (
  String.fromCharCode(...data)
)

export const encodeIntData = int => (
  int.toString().split('').map(digit => digit.charCodeAt(0))
)

export const decodeIntData = data => (
  parseInt(String.fromCharCode(...data))
)

export const encodeFloatData = float => (
  float.toFixed(3).split('').map(digit => digit.charCodeAt(0))
)

export const decodeFloatData = data => (
  parseFloat(String.fromCharChode(...data))
)

export const checksum = ({
  length,
  address,
  command,
  data
}) => {
  let checksum = length;

  [
    ...address,
    ...[
      command,
      ...data
    ].map(chr => chr.charCodeAt(0))
  ]
  .forEach(byte => { checksum ^= byte })

  return checksum
}

export const toBytes = (message) => [
    message.prefix,
    message.length,
    ...(decodeAddress(message.address || [])),
    message.command,
    ...(message.data || []),
    message.checksum,
    message.term,
].filter(el => el !== undefined).map(chr => typeof chr === "string" ? chr.charCodeAt(0) : chr)
//  return Buffer.from([
//    ...message.prefix,
//    message.length,
//    message.address,
//    message.command,
//    ...message.data,
//    msg.checksum,
//    message.term,
//  ])
//}

export const fromBytes = (serialData) => {
    //serialData = String.fromCharCode(...serialData)

  const
        prefix         = String.fromCharCode(serialData[0]),
        length         = serialData[1],
        address        = encodeAddress([...serialData.slice(2,6)]),
        command        = String.fromCharCode(serialData[6]),
        data           = String.fromCharCode(...serialData.slice(7, serialData.length - 2)),
        checksum       = serialData[serialData.length - 2],
        term           = String.fromCharCode(serialData[serialData.length - 1])

  return {
    prefix,
    length,
    address,
    command,
    data,
    checksum,
    term
  }
}

export const asString = ({
  prefix,
  msidParam,
  errorStatus,
  opCode,
  address,
  payload
}) => (
`prefix       : 0x${prefix.toString('hex')}
msidParam    : 0x${msidParam.toString(16)}
errorStatus  : 0x${errorStatus.toString(16)}
opCode       : 0x${opCode.toString(16)}/${Object.keys(scaleCodes).find(key => scaleCodes[key] === opCode)}
address      : 0x${address.toString(16)}
payload      : 0x${payload.toString('hex')}/${payload.readBigInt64BE().toString(10)}/${payload.slice(0,4).readFloatBE()}F - ${payload.slice(4).readFloatBE()}F`
)

export const log = (message) => {
  log.info(asString(message))
}
