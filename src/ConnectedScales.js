import React,
       {
         useContext,
         useState,
       }            from 'react'

import Context      from './Context'

import stylesheet   from './styles'

const ConnectedScales = ({
  refreshScales,
}) => {
  const [{connectedScales}, dispatch] = useContext(Context)

  return(

    <element 
      top={18}
      width="50%"
      class={stylesheet.bordered}
      label="Connected Scales"
    >

    <button
      name="refresh"
      onPress={() => {refreshScales()}}
      keys
      mouse
      height={3}
      width={9}
      class={stylesheet.bordered}

    >
      Refresh
    </button>

    <listtable
      mouse={ true }
      keys={ true }
        top={7}
        height="50%"

        style={{
              item: { fg: 'magenta' },
              selected: { fg: 'black', bg: 'magenta' },
            }}
      rows={[
        ['Address'],
        ...Object.values(connectedScales).map(scale => [scale.address.toString()])
      ]}
      onSelect={(scale, index) => {
          console.log(index)
          console.log(connectedScales)
          dispatch({
            type: 'scaleSelected',
            //index-1 because tablelist uses first index for column headers durp
            payload: {selectedScale: Object.values(connectedScales)[index-1]}
          })
      }}
    />
    </element>
    )
}

export default ConnectedScales
