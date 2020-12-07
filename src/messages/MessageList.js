import React, {
       useContext
}                   from 'react'

import Context      from '../Context'

import {ScaleMessages } from '../scales'

//import stylesheet from './styles'

const MessageList = React.memo((props) => {

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
})

export default MessageList
