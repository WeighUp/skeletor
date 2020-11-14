//delimeters
export const TAIL                 = '>' //0x3E
export const HEAD                 = '<' //0x3C

//command code chars
export const SAMPLE_DEADLOAD      = 'E'
export const SAMPLE_CALIBRATION   = 'F'
export const RESET_CELL           = 'R'
export const ZERO_CELL            = 'Z'
export const START_CALIBRATION_MODE  = 'C'
export const RESET_TO_DEFAULTS    = 'D'
export const START_FACTORY_MODE   = '$'
export const GET_CAPACITY         = 'Q'
export const GET_CALIBRATION_VALUE  = 'O'
export const GET_REVISION         = 'V'
export const GET_WEIGHT           = 'W'
export const GET_COUNTS           = 'Y'
export const GET_SEED             = 'T'
export const GET_GRADUATION_SIZE  = 'P'
export const GET_UNIQUE_ID        = '?'
export const SAVE_DEFAULTS        = 'H'
export const START_NORMAL_MODE    = '#'
export const SET_CAPACITY         = 'M'
export const SET_CALIBRATION_VALUE  = 'B'
export const SET_SEED             = 'S'
export const SET_GRADUATION_SIZE  = 'G'

//command response chars
export const SAMPLE_DEADLOAD_RESP      = 'e'
export const SAMPLE_CALIBRATION_RESP   = 'f'
export const RESET_CELL_RESP           = 'r'
export const ZERO_CELL_RESP            = 'z'
export const START_CALIBRATION_MODE_RESP  = 'c'
export const RESET_TO_DEFAULTS_RESP    = 'd'
export const START_FACTORY_MODE_RESP   = '$'
export const GET_CAPACITY_RESP         = 'q'
export const GET_CALIBRATION_VALUE_RESP  = 'o'
export const GET_REVISION_RESP         = 'v'
export const GET_WEIGHT_RESP           = 'w'
export const GET_COUNTS_RESP           = 'y'
export const GET_SEED_RESP             = 't'
export const GET_GRAD_SIZE_RESP        = 'p'
export const GET_UNIQUE_ID_RESP        = '?'
export const SAVE_DEFAULTS_RESP        = 'h'
export const START_NORMAL_MODE_RESP    = '#'
export const SET_CAPACITY_RESP         = 'm'
export const SET_CALIBRATION_VALUE_RESP  = 'b'
export const SET_SEED_RESP             = 's'
export const SET_GRADUATION_SIZE_RESP  = 'g'
export const GET_ADDRESSES_RESP        = '?'

//addresses
export const ADDR_DELIM    = '?'
//                           ['?', 'A', 'D', 'D', 'R', '?']
export const GET_ADDRESSES = [ADDR_DELIM, 'A', 'D', 'D', 'R', ADDR_DELIM]
