import dotenv from 'dotenv'

dotenv.config()

export const WEIGHUP_SCALE_DEVICE_PATH = process.env.WEIGHUP_SCALE_DEVICE_PATH || '/dev/ttyUSB0';
export const WEIGHUP_API_URL           = process.env.WEIGHUP_API_URL || 'http://localhost:8000/api/v1'
export const WEIGHUP_HUB_ID            = parseInt(process.env.WEIGHUP_HUB_ID) || 1
export const WEIGHUP_SCALE_INTERVAL    = parseInt(process.env.WEIGHUP_SCALE_INTERVAL) || 500
export const WEIGHUP_SERIAL_INTERVAL   = parseInt(process.env.WEIGHUP_SERIAL_INTERVAL) || 80
export const WEIGHUP_CONNECTED_SCALES_FILE = process.env.WEIGHUP_CONNECTED_SCALES_FILE || './config/connectedScales.json'
