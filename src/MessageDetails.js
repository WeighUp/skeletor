import React, {
       useContext
}                   from 'react'

import Context      from './Context'

import * as ScaleMessages from './scaleMessages'

import stylesheet from './styles'

const MessageDetails = () => {
  const [{selectedMessage}, dispatch] = useContext(Context)

  return(
    <box
     top={3}
    height={15}
    left="50%"
    label="Message Details"
    class={stylesheet.bordered}
    >
      { selectedMessage &&
`Raw: ${ScaleMessages.toBytes(selectedMessage.message).toString('hex')}
${ScaleMessages.asString(selectedMessage.message)}`
      }
    </box>
  )
}

export default MessageDetails
