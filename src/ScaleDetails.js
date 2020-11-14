import React, {
  useContext,
  useState,
  useMemo,
}                   from 'react'

import {
  Line,
  Table,
}                   from 'react-blessed-contrib'

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
        top={0}
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
      <box
        top={5}
        height={10}
        width="100%"
      >
        <list
          mouse={ true }
          keys={ true }
          top={0}
          height="100%"
          width="50%"
          style={{
                item: { fg: 'magenta' },
                selected: { fg: 'black', bg: 'magenta' },
              }}
          items={
            //['Reading Time', 'Measurement'],
            //["time" , "meas"]
            //...(selectedScale.measurements.map(m => ["time", "sdg"]))
            selectedScale.measurements.map(m => `${m.readingTime.format('h:mm:ss')}, ${m.measurement.toString()}`)
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
        <Line
          top={0}
          height="100%"
          left="50%"
          width="50%-1"
          data={[
            {
              title: 'Measurements',
              ...selectedScale
              .measurements
              .reduce(
                (xy, measurement) => (
                  {
                    x : [...xy.x, measurement.readingTime.second()],
                    y : [...xy.y, measurement.measurement]
                  }
                ),
                {x:[], y:[]}
              ),
              style: {line: 'red'}
            },
            //{x: [1,2,3,4,5], y: [1,2,3,4,5], title: 'foo'}
          ]}
          minY={0}
          maxY={1000}
          style={{style:{text: 'blue', baseline: 'black'}}}
          xLabelPadding={0}
          xPadding={0}
          showLegend={false}
          wholeNumbersOnly={false}
          label='Measurements'
        />
      </box>

      <Table
        //ref={table}
        label="Scale Parameters"
        mouse={ true }
        keys={ true }
        interactive={true}
          top={15}
          height="100%-15"

        data={{
          headers: ['Address', 'Capacity'],
          data: [
            [100, 300]
          ]
        }}
        columnWidth={[10]}
      />
    </box>
    )
  }, [connectedScales])
}

export default ScaleDetails
