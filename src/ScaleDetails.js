import React,
       {
         useContext,
         useState,
       }            from 'react'

import Context      from './Context'

import stylesheet   from './styles'

const ScaleDetails = ({
  youAreSubmit,
  setSerialSubmit,
  writeFlashSubmit,
  ...rest
}) => {
  const [{selectedScale}, dispatch] = useContext(Context)

  const [newAddress, setNewAddress] = useState(null)
  const [serial,     setSerial    ] = useState(null)

  return (
    <box
      label={`Scale Details ${selectedScale ? `- ${selectedScale.address.toString(16)}` : ''}`}
      class={stylesheet.bordered}
      {...rest}
    >
      
      <listtable
        mouse={ true }
        keys={ true }
        top={7}
        height="50%"

        style={{
              item: { fg: 'magenta' },
              selected: { fg: 'black', bg: 'magenta' },
            }}
        rows={
          Object.entries(selectedScale || {})
        }

        onSelect={(scale, index) => {
          //console.log(index)
          //console.log(connectedScales)
          //dispatch({
          //  type: 'scaleSelected',
          //  //index-1 because listtable uses first index for column headers durp
          //  payload: {selectedScale: Object.values(connectedScales)[index-1]}
          //})
        }}
      />
      <element 
        top={3}
        width="96%"
        height={5}
        class={stylesheet.bordered}
        label="Calibration"
      >
       <button
         name=""
         onPress={() => {
           youAreSubmit(
             selectedScale.address,
             parseInt(newAddress, 16),
             parseInt(serial, 16)
           )
         }}
         keys
         mouse
         height={3}
         width={14}
         left={36}
         class={stylesheet.bordered}
       >
        Calibration Mode
       </button>
      </element>

    </box>
  )
}

export default ScaleDetails
