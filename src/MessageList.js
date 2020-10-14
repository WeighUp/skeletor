import React, {
       useContext
}                   from 'react'

import Context      from './Context'

import * as ScaleMessages from './scaleMessages'

import stylesheet from './styles'

const MessageList = (props) => {
  const [state, dispatch] = useContext(Context)

  return <list
    class={stylesheet.bordered}

      mouse={ true }
      keys={ true }

        style={{
              item: { fg: 'magenta' },
              selected: { fg: 'black', bg: 'magenta' },
            }}

      {...props}
    />
}

export default MessageList
