import * as ScaleCodes from './scaleCodes'


export const getAddresses = () => ({
  prefix : ScaleCodes.HEAD,
  data   : ScaleCodes.GET_ADDRESSES ,
  term   : ScaleCodes.TAIL
})

  // set an address
export const getWeight = () => {
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

