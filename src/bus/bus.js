const serialInterval = 50
const scaleInterval  = 200

const serialBus = (send) => {
  let _scaleBusses  = {}

  const addScale = address => {
    _scaleBusses[address] = scaleBus(send)
    _scaleBusses[address].start()
  }

  const removeScale = address => {
    let discard
    ({[address] : discard, ..._scaleBusses} = _scaleBusses)
  }

  const scaleBusses = () => _scaleBusses

  return {
    addScale,
    removeScale,
    scaleBusses,
    ...bus(msg => {
      if (msg.address) {
        if (!_scaleBusses[msg.address]) {
          addScale(msg.address)
        }

        _scaleBusses[msg.address].push(msg)
      }
      else{
        send(msg)
      }
    }, serialInterval)
  }
}

const scaleBus = (send) => {
  return {
    ...bus(msg => {
      send(msg)
    }, scaleInterval)
  }
}

const bus = (consumer, interval) => {
  let messageQueue = []
  let consumerLoop

  const start = () => {
    consumerLoop = setInterval(
      () => {
        let msg
        if (msg = messageQueue.pop()) {
          consumer && consumer(msg)
        }
      },
      interval
    )
  }

  const stop = () => {clearInterval(consumerLoop)}

  const messages = () => [...messageQueue]

  const push = msg => {
    messageQueue.unshift(msg)
  }

  const clear = () => { messageQueue = [] }

  return {
    messages,
    push,
    clear,
    start,
    stop
  }
}

export {
  serialInterval,
  scaleInterval,
  bus,
  serialBus,
  scaleBus
}
