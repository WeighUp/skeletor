import React      from 'react'

import stylesheet from './styles'

const ConnectionForm = () => {
    return(
      <form
        keys
        vi
        focused
        left="0%"
        width="50%"
      >

        <textbox
          height={3}
          width="80%"
          keys
          mouse
          inputOnFocus
          class={stylesheet.bordered}
          label="Device Path/Identifier"
        >
    </textbox>
    <button
    height={3}
    width={9}
    class={stylesheet.bordered}
    left="80%"

    >
     Connect
    </button>
      </form>
    )
}

export default ConnectionForm
