import React, {
       useContext
}                   from 'react'


import {
  useSelector,
  useDispatch
}                         from 'react-redux/lib/alternate-renderers'

import { ScaleMessages } from '../scales'

import stylesheet from '../styles'

const MessageDetails = ({...rest}) => {
  const {selectedMessage} = useSelector(state => ({...state}))

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
