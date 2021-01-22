import * as ScaleCodes from './scaleCodes'
import * as ScaleMessages from './scaleMessages'


export const getAddresses = () => ({
  prefix : ScaleCodes.HEAD,
  data   : ScaleCodes.GET_ADDRESSES ,
  term   : ScaleCodes.TAIL
})


export const getWeight = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_WEIGHT,
    data    : [],
  })
}


/**
 * Sample zero load for calibration procedure
 */
export const sampleDeadload = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.SAMPLE_DEADLOAD,
    data    : [],
  })
}

/**
 * Sample known calibration weight for calibration procedure
 */
export const sampleCalibrationLoad = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.SAMPLE_CALIBRATION,
    data    : [],
  })
}

/**
 * Cell will reboot within 2 seconds
 */
export const resetCell = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.RESET_CELL,
    data    : [],
  })
}

/**
 * Zero the current weight reading of the cell
 */
export const zeroCell = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.ZERO_CELL,
    data    : [],
  })
}


/**
 * cell capacity
 * max capacity is 10000
 */
export const getCapacity = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_CAPACITY,
    data    : [],
  })
}

/**
 * cell calibration value
 * Known calibration weight value used in calibration procedure
 * Max value is 10000.
 */
export const getCalibrationValue = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_CALIBRATION_VALUE,
    data    : [],
  })
}

/**
 * firmware revision
 */
export const getRevision = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_REVISION,
    data    : [],
  })
}

/**
 * Current A2D Counts
 * Returns the current filtered A2D counts value.
 * The filter is a moving average of the last n A2D readings,
 * where n is the current filter seed value.
 */
export const getCounts = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_COUNTS,
    data    : [],
  })
}

/**
 * A2D filter seed
 * Filter seed is the number of A2D readings averaged
 * together to produce the filtered counts value.
 */
export const getSeed = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_SEED,
    data    : [],
  })
}

/**
 * Cell Graduation Size
 * Returns the division size (smallest possible measurement)
 * of the cell.
 */
export const getGraduationSize = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_GRADUATION_SIZE,
    data    : [],
  })
}

/**
 * Cell unique ID
 * ID returned in ASCII representation of hex bytes.
 */
export const getUniqueID = (address) => {
  return ScaleMessages.scaleMessage({
    address,
    command : ScaleCodes.GET_UNIQUE_ID,
    data    : [],
  })
}
