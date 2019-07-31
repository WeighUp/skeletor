import React, {
       useContext,
       useRef
}                   from 'react'

import Context      from './Context'

import stylesheet from './styles'


const ConnectionForm = ({onSubmit, onDisconnect, connected}) => {
  let [
    state,
    dispatch
  ] = useContext(Context)

  const formRef = useRef(null)

    return(
      <form
        ref={formRef}
        keys
        left="0%"
        width="50%"
        onSubmit={onSubmit}
      >

        <textbox
          name="devicePath"
          height={3}
          width="80%"
          keys
          mouse
          inputOnFocus
          class={stylesheet.bordered}
          label={`${state.port} Device Path/Identifier`}
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
            left="80%"

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
            left="80%"

          >
           Disconnect
          </button>
        }
      </form>
    )
}

export default ConnectionForm
