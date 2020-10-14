import * as sm from './scaleMessages'
import * as sc from './scaleCodes'

describe('scaleMessages', () => {
  const address = '00ffff00'
  //const encodedAddress = sm.encodeAddress('ffff')

  const testMessage = {
        prefix  : sc.HEAD,
        length  : 7,
        address,
        command : sc.GET_WEIGHT,
        data    : '',
        checksum : 0x50,
        term    : sc.TAIL
  }

  describe('encodeAddress()', () => {
    it('encodes address to ascii string of 4 2-hexadigit values', () => {
      expect(sm.encodeAddress([0, 16, 66, 127])) 
      .toEqual('0010427F')
    })
  })

  describe('decodeAddress()', () => {
    it('decodes ascii string of 4 2-hexadigit values into 4-byte array', () => {
      expect(sm.decodeAddress('0010427F'))
      .toEqual([0, 16, 66, 127])
    })
  })

  describe('encodeIntData()', () => {
    it('encodes integer data to array of ascii values', () => {
      expect(sm.encodeIntData(12))
      .toEqual([0x31, 0x32])
    })
  })

  describe('encodeFloatData()', () => {
    it('encodes integer data to array of ascii values', () => {
      expect(sm.encodeIntData(12))
      .toEqual([0x31, 0x32])
    })

    it('encodes float data to array of ascii values', () => {
      expect(sm.encodeFloatData(1.234))
      .toEqual([0x31, 0x2E, 0x32, 0x33, 0x34])
    })

    it('expands to 3 decimal places', () => {
      expect(sm.encodeFloatData(123.4))
      .toEqual([0x31, 0x32, 0x33, 0x2E, 0x34, 0x30, 0x30])
    })
  })

  describe('encodeData()', () => {
    it('encodes float data to array of ascii values', () => {
      expect(sm.encodeData(1.234))
      .toEqual([0x31, 0x2E, 0x32, 0x33, 0x34])
    })

    it('expands to 3 decimal places', () => {
      expect(sm.encodeData(123.4))
      .toEqual([0x31, 0x32, 0x33, 0x2E, 0x34, 0x30, 0x30])
    })
  })

  describe('decodeData()', () => {
    it('returns the data decoded', () => {
      expect(sm.decodeData([0x31, 0x32, 0x33, 0x2E, 0x34, 0x30, 0x30]))
      .toEqual(123.4)
    })
  })

  describe('scaleMessage()', () => {
    it('returns valid scale message', () => {
      expect(sm.scaleMessage(
        {
          address,
          command: sc.GET_WEIGHT,
          data: []
        }
      )).toEqual({
        prefix  : sc.HEAD,
        length  : 7,
        address,
        command : sc.GET_WEIGHT,
        data    : [],
        checksum : 0x50,
        term    : sc.TAIL
      })
    })
  })

  describe('checksum()', () => {
    it('computes valid checksum', () => {
      expect(sm.checksum(testMessage))
      .toEqual(0x50)
    })
  })

  describe('toBytes()', () => {
    it('converts to bytes', () => {
      expect(sm.toBytes({
        address,
        checksum : 47,
        command  : "W",
        data     : [],
        length   : 11,
        prefix   : "<",
        term     : ">",
      }))
      .toEqual([])
    })
  })
})
