import React, {
       useContext
}                   from 'react'

import Context      from './Context'

import stylesheet   from './styles'

const ConnectedScales = () => {
  const [state, setState] = useContext(Context)

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
        ...state.connectedScales.map(scale => [scale.sequenceNo.toString(), scale.serialNo.toString(16)])
      ]}
      onSelect={(scale, index) => setState({selectedScale: state.connectedScales[index-1]})}
    />
    </element>
    )
}

export default ConnectedScales
