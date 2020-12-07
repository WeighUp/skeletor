import React, {
       useContext
}                   from 'react'

import Context      from '../Context'

import { ScaleMessages } from '../scales'

//import stylesheet from './styles'

const MessageDetails = ({...rest}) => {
  const [{selectedMessage}, dispatch] = useContext(Context)

  return(
    <box
    label="Message Details"
    class={stylesheet.bordered}
    {...rest}
    >
      { selectedMessage &&
`Raw: ${ScaleMessages.toBytes(selectedMessage.message).toString('hex')}
${ScaleMessages.asString(selectedMessage.message)}`
      }
    </box>
  )
}

export default MessageDetails
