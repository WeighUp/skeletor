import React, {
       useContext
}                   from 'react'

import Context      from './Context'

import * as ScaleMessages from './scaleMessages'

import stylesheet from './styles'

const MessageList = () => {
  const [state, dispatch] = useContext(Context)

  return <list
      top={3}
      height={15}
      width="50%"
    class={stylesheet.bordered}

      mouse={ true }
      keys={ true }

        style={{
              item: { fg: 'magenta' },
              selected: { fg: 'black', bg: 'magenta' },
            }}
    label="Incoming Messages"
    items={state.scaleMessages.map((msg, index) => `${index} - ${ScaleMessages.toBytes(msg.message).toString('hex')}`)}
    onSelect={(msg, index) => dispatch({type: 'messageSelected', payload: {selectedMessage: state.scaleMessages[index]}})}
    />
}

export default MessageList
