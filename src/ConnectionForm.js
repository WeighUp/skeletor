import React, {
       useRef,
       useState
}                   from 'react'

import { useDispatch } from 'react-redux/lib/alternate-renderers'


import stylesheet from './styles'


const ConnectionForm = ({
  onSubmit,
  onDisconnect,
  connected,
  ...rest
}) => {
  const dispatch = useDispatch()

  const formRef = useRef(null)

    return(
      <box
        {...rest}
      >
      <form
        ref={formRef}
        keys
        onSubmit={onSubmit}
      >

        <textbox
          name="devicePath"
          height={3}
          width="100%-12"
          keys
          mouse
          inputOnFocus
          class={stylesheet.bordered}
          label={`Device Path/Identifier${connected ? " (Connected)" : ""}`}
          onSubmit={ devicePath => {dispatch({type: 'setDevicePath', payload: {devicePath}})}}
        />
        { !connected &&
          <button
            name="submit"
            onPress={() => {formRef.current.submit()}}
            keys
            mouse
            height={3}
            width={9}
            class={stylesheet.bordered}
            left="100%-9"

          >
           Connect
          </button>
        }
        { connected &&
          <button
            name="disconnect"
            onPress={() => {onDisconnect()}}
            keys
            mouse
            height={3}
            width={12}
            class={stylesheet.bordered}
            left="100%-12"

          >
           Disconnect
          </button>
        }
      </form>
        </box>
    )
}

export default ConnectionForm
