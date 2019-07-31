import React, {
       useContext
}                   from 'react'

import Context      from './Context'

import stylesheet   from './styles'

const ConnectedScales = () => {
  const [state, dispatch] = useContext(Context)

    return(

    <element 
      top={18}
      width="50%"
      class={stylesheet.bordered}
      label="Connected Scales"
    >
    <listtable
      mouse={ true }
      keys={ true }
        height="50%"

        style={{
              item: { fg: 'magenta' },
              selected: { fg: 'black', bg: 'magenta' },
            }}
      rows={[
        ['Sequence #', 'Serial #'],
        ...Object.values(state.connectedScales).map(scale => [scale.address.toString(), scale.serialNo.toString(16)])
      ]}
      onSelect={(scale, index) => dispatch({type: 'scaleSelected', payload: {selectedScale: state.connectedScales[index-1]}})}
    />
    </element>
    )
}

export default ConnectedScales
