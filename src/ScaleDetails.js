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
}) => {
  const [{selectedScale}, dispatch] = useContext(Context)

  const [newAddress, setNewAddress] = useState(null)
  const [serial,     setSerial    ] = useState(null)

  return (
    <element
      top={20}
      left="50%"
      label={`Scale Details ${selectedScale ? `- ${selectedScale.address.toString(16)} - ${selectedScale.serialNo.toString(16)}` : ''}`}
      class={stylesheet.bordered}
    >
      <element 
        top={3}
        width="96%"
        height={5}
        class={stylesheet.bordered}
        label="Set Address/Serial No."
          setSerialSubmit={(address, serialNo)=> {
            if(port) {
              port.write(
                ScaleMessages.toBytes(
                  ScaleCommands.setSerial(address, serialNo)
                )
              )
            }
          }}
      >

        <textbox
          name="newAddress"
          height={3}
          width={11}
          left={9}
          keys
          mouse
          inputOnFocus
          class={stylesheet.bordered}
          label='New Addr'
          onSubmit={setNewAddress}
        />

        <textbox
          name="serialNo"
          height={3}
          width={13}
          left={20}
          keys
          mouse
          inputOnFocus
          class={stylesheet.bordered}
          label='Serial No.'
          onSubmit={setSerial}
        />

        <button
          name="ccmdYouAre"
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
          CCMD_YOU_ARE
        </button>

        <button
          name="ccmdSetSerial"
          onPress={() => {
            setSerialSubmit(
              selectedScale.address,
              parseInt(serial, 16)
            )
          }}
          keys
          mouse
          height={3}
          width={17}
          left={50}
          class={stylesheet.bordered}
        >
          CCMD_SET_SERIAL
        </button>
      </element>
        
      <element 
        top={8}
        width="96%"
        height={5}
        class={stylesheet.bordered}
        label="Write Flash"
      >

        <button
          name="ccmdWriteFlash"
          onPress={() => {
            writeFlashSubmit(
              selectedScale.address,
              selectedScale.serialNumber,
            )
          }}
          keys
          mouse
          height={3}
          width={17}
          left={50}
          class={stylesheet.bordered}
        >
          CCMD_SET_SERIAL
        </button>

      </element>
    </element>
  )
}

export default ScaleDetails
