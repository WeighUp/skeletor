const bus = (consumer = ()=>{}, interval, timeout) => {
  let messageQueue = []
  let consumerLoop
  let lock = false
  let lastSentTime = Date.now()

  const start = () => {
    consumerLoop = setInterval(
      () => {
        if (!lock || Date.now() - lastSentTime >= timeout) {
          let msg
          if (msg = messageQueue.pop()) {
            consumer && consumer(msg)
            lock = true
            lastSentTime = Date.now()
          }
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

  const unlock = () => { lock = false }

  return {
    messages,
    push,
    clear,
    start,
    stop,
    unlock
  }
}

export {
  bus
}
