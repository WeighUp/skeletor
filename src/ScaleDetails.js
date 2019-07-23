import React, {
       useContext
}                   from 'react'

import Context      from './Context'

import stylesheet   from './styles'

const ScaleDetails = () => {
  const [state, setState] = useContext(Context)
  const scale = state.selectedScale

  return (
    <element
      top={18}
      left="50%"
      label={`Scale Details ${scale ? `- ${scale.sequenceNo}` : ''}`}
      class={stylesheet.bordered}
    >
    </element>
  )
}

export default ScaleDetails
