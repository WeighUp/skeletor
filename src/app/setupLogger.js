import log from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

//use loglevel logger throughout app
global.log = log
prefix.reg(log)
log.enableAll()
prefix.apply(log, {
  template: '[%t] %l:',
  levelFormatter: function (level) {
    return level.toUpperCase();
  },
  timestampFormatter: function (date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  }
})
