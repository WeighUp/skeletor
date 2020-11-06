import React,
       {
         useContext,
         useState,
         useMemo,
       }            from 'react'

import Context      from './Context'

import * as sm from './scaleMessages'

import stylesheet   from './styles'

const ScaleDetails = ({
  ...rest
}) => {
  let [{scales: {selectedScale, connectedScales}, scaleMessages}, dispatch] = useContext(Context)


  const [newAddress, setNewAddress] = useState(null)
  const [serial,     setSerial    ] = useState(null)



  return useMemo(() => {
    if(!selectedScale) return <box class={stylesheet.bordered} {...rest}/>
  
    selectedScale = connectedScales[selectedScale.address]
  
    let messages = scaleMessages.incoming.filter(msg => (msg.message.address === selectedScale.address || msg.message.data === selectedScale.address))
    
    return (<box
      label={`Scale Details ${selectedScale ? `- ${selectedScale.address.toString(16)}` : ''}`}
      class={stylesheet.bordered}
      {...rest}

    >

      <box 
        top={3}
        width="100%-2"
        height={5}
        class={stylesheet.bordered}
        label="Calibration"
      >
       <button
         name=""
         onPress={() => {
         }}
         keys
         mouse
         height={3}
         width={18}
         left="100%-20"
         class={stylesheet.bordered}
       >
        Calibration Mode
       </button>
      </box>
      <list
        mouse={ true }
        keys={ true }
        top="50%"
        height="50%"

        style={{
              item: { fg: 'magenta' },
              selected: { fg: 'black', bg: 'magenta' },
            }}
        items={
          //['Reading Time', 'Measurement'],
          //["time" , "meas"]
          //...(selectedScale.measurements.map(m => ["time", "sdg"]))
          selectedScale.measurements.map(m => `${m.readingTime.toString()}, ${m.measurement.toString()}`)
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

    </box>
    )
  }, [connectedScales])
}

export default ScaleDetails
