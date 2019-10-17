# WeighUp Scale Protocols

## Values Stored in FLASH NV Memory
```
unsigned short g_usAddressMem;
unsigned long  g_ulSerialNumMem;
         long  g_lZeroMem;
         float g_fScaleMem;
         float g_fdzdtMem;
         float g_fdsdtMem;
unsigned short g_usSecondsAutoWeightMem;
unsigned short g_usAutoRezeroMem;
```

## CAN Bus Communications
The unit communicates on a CAN 2.0B bus at 125kb using extended messages. The PC host is
a Besram unit that appears as a virtual COM port (VCP) to Windows. The units have a serial
baud of either 1228800 or 2000000 by default and can be modified using their software.
The Besram CAN converter has a built-in 120Ω termination resistor. The last scale requires a
120Ω resistor across the differential pair.

### Message Format
- 15 bytes
- Fixed-length segments
- Big endian

```
address - [0     |1     |2     |3     |4     |5      |       6 - 13          |14   ]
meaning - [BOF   |extd  |MSID  |error |opcode|address|data (big endian)      |EOF  ]
example - [0xAA  |0xE8  |0x80  |0x00  |0x08  |0x01   |0x44 0x5D 0x59 0x0C... |0x55 ]
```

At boot, each scale sends a CAN packet. The Besram CAN to USB adapter converts this to a
serial stream. The packets start with 0xAAE8 and end with 0x55. The 0xAA is a start of frame
and the 0x55 is an end of frame, but caution is needed since the CAN data may contain 0xAA
and 0x55. It is advisable to count bytes from 0xAAE8 (there will be 12 CAN packet bytes). The
0xE8 denotes an extended frame. The packet formats shown below are the CAN bytes,
excluding the Besram frame bytes: [0xAAE8][____________][0x55].
The four byte MSID is sent in reverse byte order compared to what would be seen in the
embedded debugger. The fourth byte is the source address. The third byte is the opcode
(0x01 is CMSG_I_AM). The remainder of the CAN MSID is 0x0000 but may also contain error
codes and other parameters.
The spontaneous startup message, Message “CMSG_I_AM”, is seen as:
```
<AA><E8> <00><00><01><00> <00><00><FF><FF><FF><FF><00><00> <55>
```

#### Message OpCodes
```
CMSG_ERROR      = 0x00
CMSG_I_AM       = 0x01
CMSG_LIFT       = 0x02
CMSG_REZERO     = 0x03
CMSG_REPLACE    = 0x04
CMSG_TARE       = 0x05
CMSG_SCALE      = 0x06
CMSG_CURWEIGHT  = 0x07
CMSG_MEAS       = 0x08
CMSG_WR_FLSH    = 0x09
CMSG_AUTOWGT    = 0x0A
CMSG_AUTOZERO   = 0x0B
CMSG_SETZERO    = 0x0C
CMSG_SETSCALE   = 0x0D
CMSG_GET_TEMP   = 0x0E
```

#### Command OpCodes
```
CCMD_REBOOT     = 0x80
CCMD_IDENTIFY   = 0x81
CCMD_YOU_ARE    = 0x82
CCMD_SET_SERIAL = 0x83
CCMD_TARE       = 0x84
CCMD_SCALE      = 0x85
CCMD_MEAS       = 0x86
CCMD_WR_FLSH    = 0x87
CCMD_AUTOWGT    = 0x88
CCMD_AUTOZERO   = 0x89
CCMD_SETZERO    = 0x8A
CCMD_SETSCALE   = 0x8B
CCMD_GET_TEMP   = 0x8C
CCMD_MAX        = 0x8D
```

#### Special Constants
```
# Besram Beginning-of-Frame character
BOF             = 0xAA

# Besram Extended-frame indicator
EXTD_MSG        = 0xE8

# Broadcast address to all scales
ADDR_ALL        = 0x00

# Empty/null value
NO_VALUE        = 0x00

# No-error error code value
NO_ERROR        = 0x00

# Besram End-of-Frame character
EOF             = 0x55
```

## Scale Commands & Messages

### Identity Commands and Responses
Messages are emitted from the scales and commands are sent to the scales. Both commands
and messages are internally transmitted between tasks.

#### Message “CMSG_I_AM”
`aa 01 00 00 00 aa ss ss ss ss 00 00`  
`aa` is the address, `ssssssss` is the serial number

The startup message is an identity statement. The first two bytes are the address and the next four bytes are the serial number. If the serial number is 0xFFFFFFFF then the unit is unconfigured and best still be at the factory. If the address is zero then the unit has not been configured on a network.

#### Command “CCMD_IDENTIFY”
Command: `aa 81 00 00 00 aa ss ss ss ss 00 00`  
Response: `aa 01 00 00 00 aa ss ss ss ss 00 00`  
`aa` is the address, `ssssssss` is the serial number

Command `CCMD_IDENTIFY` (0x81) may be sent to obtain the `CMSG_I_AM` packet. Sending to address 0x00 will poll all connected devices, otherwise, only devices with matching addresses will process the command

Tested: “identify” and resulting “I am”:
```
<AA><E8><00><00><81><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><01><00><00><00><FF><FF><FF><FF><00><00><55>
```

#### Command “CCMD_YOU_ARE”
Command: `aa 82 00 00 aa aa ss ss ss ss 00 00`  
Response: `aa 01 00 00 00 aa ss ss ss ss 00 00`  
`aa` is the address, `ssssssss` is the serial number

Command `CCMD_ YOU_ARE` (0x82) takes the serial number to be configured as the 3rd – 6th bytes of the payload. Any device receiving the command and having a matching serial number will have the address in the first two bytes assigned. Note that only the LSB of the address is useable in the CAN packets.

The assigned address is only retained in RAM. The response is `CMSG_I_AM`.

Tested: “you are” and resulting “I am”, setting address to 1.
```
<AA><E8><00><00><82><00><00><01><FF><FF><FF><FF><00><00><55>
<AA><E8><80><00><01><01><00><01><FF><FF><FF><FF><00><00><55>
```

#### Command “CCMD_SET_SERIAL”
Command: `aa 83 00 00 00 aa ss ss ss ss 00 00`  
Response: `aa 01 00 00 00 aa ss ss ss ss 00 00`  
`aa` is the address, `ssssssss` is the serial number

Command `CCMD_SET_SERIAL` (0x83) takes the serial number in the 3rd – 6th bytes of the payload and assigns it to the device. Any device receiving the command and having a matching address to the first two bytes will be set to this serial number. Note that only the LSB of the address is useable in the CAN packets.

The assigned address is only retained in RAM. `The response is CMSG_I_AM`.

Tested: “set serial” and resulting “I am”, setting serial number to 0x12345678
```
<AA><E8><00><00><83><01><00><01><12><34><56><78><00><00><55>
<AA><E8><00><00><01><01><00><01><12><34><56><78><00><00><55>
```

### Calibration Commands and Responses

#### Command “CCMD_TARE”
Command: `aa 84 00 00 mm mm 00 00 00 00 00 00`  
Response: `aa 05 ee 00 zz zz zz zz 00 00 00 00`  
    Or    `aa 0A ee 00 zz zz zz zz 00 00 00 00`  
`aa` is the address, `mmmm` is the number of ms to average, `zzzzzzzz` is the averaged ADC count at
zero, `ee` is an error code if non-zero

The response might be `CMSG_TARE` or `CMSG_REZERO`

This command instructs the unit to make uncalibrated measurements and to average them
to reset the “zero ADC counts”. Values are ignored until the automated measurement task
resets its averaging. Thereafter, the measurement task averages ADC counts until the time
elapses. If no valid measurements are made in the time allotted, then the command fails.

The response is `CMSG_TARE` (0x05) with the unsigned long ADC value corresponding to zero
in the first four data bytes. The new zero level is only retained in RAM.

Tested: When any command is disabled by build settings, the response is an error code with the same opcode:
```
<AA><E8><00><00><84><00><00><03><00><00><00><00><00><00><55>
<AA><E8><00><FF><84><00><00><03><00><00><00><00><00><00><55>
```

Tested: When enabled by build settings, the response is a CMSG_TARE message (0x05), followed by a spurious CMSG_LIFT (0x02) message from the old non-zero weight to the new zero value:
```
<AA><E8><00><00><84><00><0B><B8><00><00><00><00><00><00><55>
<AA><E8><00><00><05><00><FF><FF><CB><F7><00><00><00><00><55>
<AA><E8><80><00><02><00><00><00><00><00><C1><55><2F><1B><55>
```

#### Command “CCMD_SCALE”
Command: `aa 85 00 00 ww ww ww ww 00 00 00 00`  
Response: `aa 06 00 00 ss ss ss ss 00 00 00 00`  
aa is the address, wwwwwwww is the weight (IEEE float), in grams, and sssssssss is the
computed scale (IEEE float) in grams/ADC count.

The startup message is an identity statement.
Not implemented as of 9/16. The command is parsed and forwarded to the measurement
task, but is not acted upon.
This command instructs the unit to make uncalibrated measurements and to average them
relative to the “zero ADC counts”. The ADC counts and the weight (as an IEEE float in grams)
are used to calculate the scale factor. The response is “CMSG_SCALE” (0x06) with the IEEE
float value corresponding to scale in the first four data bytes in grams per ADC count.
The new scale is only retained in RAM.
Tested: When any command is disabled by build settings, the response is an error code
with the same opcode:
```
<AA><E8><00><00><85><00><00><03><00><00><00><00><00><00><55>
<AA><E8><00><FF><85><00><00><03><00><00><00><00><00><00><55>
```

### Memory and Reboot Commands

#### Command “CCMD_WR_FLSH”
Command: `aa 87 00 00 00 aa ss ss ss ss 00 00`  
Response: `aa 08 ee 00 00 00 00 00 00 00 00 00`  
aa is the address, ssssssss is the serial number, ee is an error code if non-zero

The device with matching serial number and address is instructed to commit the RAM values
to FLASH. The response is “CMSG_WR_FLASH” (0x08) with no data and any error codes in the
remainder of the msid.
Tested: wrote “CCMD_WR_FLSH” and received “CMSG_WR_FLSH” with no error.
```
<AA><E8><00><00><87><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><09><01><00><00><00><00><00><00><00><00><55>
```

#### Command “CCMD_REBOOT”
`aa 80 00 00 00 00 00 00 00 00 00 00`  
Response: `aa 01 00 00 00 aa ss ss ss ss 00 00`  
aa is the address, ssssssss is the serial number

All RAM values are lost and reloaded from NVM. On reboot, CMSG_I_AM is sent.
Tested: “reboot” and resulting “I am”, showing NVM held (lost on reprogramming),
confirming CCMD_WR_FLASH worked.
```
<AA><E8><00><00><80><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><01><01><00><01><12><34><56><78><00><00><55>
```

### Measurement Commands and Responses

#### Command “CCMD_MEAS”
Command: `aa 86 00 00 00 00 00 00 00 00 00 00`  
Response: `aa 07 ee 00 ww ww ww ww dd dd dd dd`  
aa is the address, wwwwwwww is the weight (IEEE float), in grams, dddddddd is the ADC count
at zero, and ee is an error code if non-zero

This command instructs the unit to return the current weight. If a valid result is cached, it is
sent. If a measurement does not stabilize within a timeout period, an error (0xee) is returned.
The response is “CMSG_MEAS” (0x08).
Tested: “CCMD_MEAS” response is “CMSG_MEAS” with weight and ADC count
```
<AA><E8><00><00><86><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><08><01><C1><5C><15><81><FF><FF><CA><4C><55>
```

#### Command “CCMD_GET_TEMP”
Command: `aa 88 00 00 00 00 00 00 00 00 00 00`  
Response: `aa 09 00 00 tt tt tt tt 00 00 00 00`  
aa is the address, tttttttt is the temperature of the PCB in ⁰C as an IEEE float.

Tested: “CCMD_GET_TEMP” and resulting “CMSG_GET_TEMP”.
```
<AA><E8><00><00><8C><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><08><00><40><8A><98><00><00><00><00><00><55>
```

#### Command “CCMD_AUTOZERO”
Command: aa 89 00 00 bb 00 00 00 00 00 00 00
Response: aa 0A 00 00 bb 00 00 00 00 00 00 00
aa is the address and bb is a Boolean value
Command executes, but have disabled functionality. Not functionally tested as of 9/16.
This command sets a Boolean value that instructs the unit to automatically rezero the scale
every time a “lift” event is detected. The response is “CMSG_AUTOZERO” (0x0A).
Tested: Command obtains response but internal function not debugged.
```
<AA><E8><00><00><89><00><00><01><00><00><00><00><00><00><55>
<AA><E8><80><00><0B><00><00><01><00><00><00><00><00><00><55>
```

#### Command “CCMD_SETZERO”
Command: aa 8A 00 00 zz zz zz zz 00 00 00 00
Response: aa 0B 00 00 zz zz zz zz 00 00 00 00
aa is the address, zzzzzzzz is the ADC count at zero
This command manually sets the zero level ADC counts. The response is “CMSG_SETZERO”
(0x0B).
Tested: Set zero to -1
```
<AA><E8><00><00><8A><00><FF><FF><FF><FF><FF><00><00><00><55>
<AA><E8><80><00><0C><00><FF><FF><FF><FF><FF><00><00><00><55>
```
Take Meas
```
<AA><E8><00><00><86><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><08><00><C1><54><7A><66><FF><FF><CC><22><55>
```
Set zero to 0
```
<AA><E8><00><00><8A><00><00><00><00><00><01><00><00><00><55>
<AA><E8><80><00><0C><00><00><00><00><00><01><00><00><00><55>
```

#### Command “CCMD_SETSCALE”
Command: `aa 8B 00 00 ss ss ss ss 00 00 00 00`  
Response: `aa 0C 00 00 ss ss ss ss 00 00 00 00`  
`aa` is the address, `sssssssss` is the computed scale (IEEE float) in grams/ADC count.
Might want to implement a second IEEE float quadratic value?

***Factory or expert use only.***
This command manually sets the scale in grams/ADC count. The response is
`CMSG_SETSCALE` (0x0D).
Tested: setting the scale sets the memory value (SRAM) and responds.  There is a
spurious “LIFT” or “REPLACE” signal from the reset of scale.
```
<AA><E8><00><00><8B><00><3C><23><D7><0A><00><00><00><00><55>
<AA><E8><00><00><0D><00><3C><23><D7><0A><00><00><00><00><55>
<AA><E8><80><00><02><00><C1><56><7C><70><C3><06><26><66><55>
```

#### Message “CMSG_CURWEIGHT”
Response: aa 07 ee 00 ww ww ww ww dd dd dd dd
aa is the address, wwwwwwww is the weight (IEEE float), in grams, dddddddd is the ADC count
at zero, and ee is an error code if non-zero
If a measurement does not stabilize within a timeout period, an error (0xee) is returned. The
response is “CMSG_CURWEIGHT” (0x07) with the weight (passed as an IEEE float) and the raw
ADC counts (0xdddddddd) as the data packet. Error codes are passed in the remainder of the
msid.
This message is used internally between the automated measurement loop and the
measurement task. It could be spontaneously emitted with additional firmware. It is sent as
the response to a CCMD_MEAS command.
Tested: can turn auto-weight on and off. When on, “CMSG_CURWEIGHT” is emitted.
```
<AA><E8><00><00><88><00><00><01><00><00><00><00><00><00><55>
<AA><E8><00><00><0A><00><00><01><00><00><00><00><00><00><55>
<AA><E8><80><00><07><00><C3><06><D0><D7><FF><FF><CB><5F><55>
<AA><E8><00><00><07><00><C3><06><CF><D2><FF><FF><CB><5F><55>
<AA><E8><80><00><07><00><C3><06><F7><80><FF><FF><CB><5B><55>
<AA><E8><00><00><07><00><C3><06><E4><0E><FF><FF><CB><4C><55>
<AA><E8><80><00><07><00><C3><06><C3><03><FF><FF><CB><49><55>
<AA><E8><00><00><07><00><C3><06><D9><68><FF><FF><CB><52><55>
<AA><E8><80><00><07><00><C3><06><D6><75><FF><FF><CB><4F><55>
<AA><E8><00><00><88><00><00><00><00><00><00><00><00><00><55>
<AA><E8><00><00><0A><00><00><00><00><00><00><00><00><00><55>
```

### Event Messages (unimplemented and reserved for future use).
#### Message “CMSG_LIFT”
Untested and unsupported – propose to detect and notify of a bottle lift (dispense).
Preliminary code also tests the AutoZero bool and attempts to recalculate the zero level;
however, this is untested. LIFT is associated with a -10g or larger weight change.
```
<AA><E8><00><00><02><00><41><87><AA><48><40><DA><15><FC><55>
```

#### Message “CMSG_REZERO”
Automatic rezeroing on LIFT is untested and unsupported – Upon retesting zero when a
bottle lift (dispense) is detected, the result of rezeroing is transmitted. To be useful, need to
NOT start Tare function until zero is settled and need to stop it before a 10g change!
Message “CMSG_REPLACE”
Untested and unsupported – propose to detect and notify of a bottle replacement. This
terminates an ongoing rezero and would be followed by the appropriate messages. REPLACE
is associated with a +10g or larger weight change.
```
<AA><E8><80><00><04><00><BF><6F><3F><F6><41><14><3E><29><55>
```
