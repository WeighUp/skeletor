import * as ScaleCodes from './scaleCodes'
import * as ScaleMessages from './scaleMessages'


export const getAddresses = () => ({
  prefix : ScaleCodes.HEAD,
  data   : ScaleCodes.GET_ADDRESSES ,
  term   : ScaleCodes.TAIL
})

  // set an address
export const getWeight = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_WEIGHT,
    data    : [],
  })
}

