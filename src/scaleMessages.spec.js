import * as sm from './scaleMessages'
import * as sc from './scaleCodes'

describe('scaleMessages', () => {
  const address = 'ffff'
  const encodedAddress = sm.encodeAddress('ffff')

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
    test('encodes address to array of ascii values', () => {
      expect(sm.encodeAddress('ffff'))
      .toEqual([0x66, 0x66, 0x66, 0x66])
    })
  })

  describe('decodeAddress()', () => {
    test('decodes array of ascii values into address', () => {
      expect(sm.decodeAddress([0x66, 0x66, 0x66, 0x66]))
      .toEqual('ffff')
    })
  })

  describe('encodeIntData()', () => {
    test('encodes integer data to array of ascii values', () => {
      expect(sm.encodeIntData(12))
      .toEqual([0x31, 0x32])
    })
  })

  describe('encodeFloatData()', () => {
    test('encodes integer data to array of ascii values', () => {
      expect(sm.encodeIntData(12))
      .toEqual([0x31, 0x32])
    })

    test('encodes float data to array of ascii values', () => {
      expect(sm.encodeFloatData(1.234))
      .toEqual([0x31, 0x2E, 0x32, 0x33, 0x34])
    })

    test('expands to 3 decimal places', () => {
      expect(sm.encodeFloatData(123.4))
      .toEqual([0x31, 0x32, 0x33, 0x2E, 0x34, 0x30, 0x30])
    })
  })

  describe('encodeData()', () => {
    test('encodes float data to array of ascii values', () => {
      expect(sm.encodeData(1.234))
      .toEqual([0x31, 0x2E, 0x32, 0x33, 0x34])
    })

    test('expands to 3 decimal places', () => {
      expect(sm.encodeData(123.4))
      .toEqual([0x31, 0x32, 0x33, 0x2E, 0x34, 0x30, 0x30])
    })
  })

  describe('decodeData()', () => {
    test('returns the data decoded', () => {
      expect(sm.decodeData([0x31, 0x32, 0x33, 0x2E, 0x34, 0x30, 0x30]))
      .toEqual(123.4)
    })
  })

  describe('scaleMessage()', () => {
    test('returns valid scale message', () => {
      expect(sm.scaleMessage(
        {
          address,
          command: sc.GET_WEIGHT,
          data: []
        }
      )).toEqual({
        prefix  : sc.HEAD,
        length  : 7,
        address : encodedAddress,
        command : sc.GET_WEIGHT,
        data    : [],
        checksum : 0x50,
        term    : sc.TAIL
      })
    })
  })

  describe('checksum()', () => {
    test('computes valid checksum', () => {
      expect(sm.checksum(testMessage))
      .toEqual(0x50)
    })
  })
})
