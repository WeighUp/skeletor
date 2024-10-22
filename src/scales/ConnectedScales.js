import React,
       {
         useContext,
         useState,
         useCallback,
         useRef,
         useEffect
       }            from 'react'

import {
  useSelector,
  useDispatch
}                   from 'react-redux/lib/alternate-renderers'

import { Table }    from 'react-blessed-contrib'

import stylesheet   from '../styles'

const ConnectedScales = ({
  ...rest
}) => {
  const {scales: {connectedScales}} = useSelector(state => ({...state}))

  const connectedScalesRef = useRef(connectedScales)
  connectedScalesRef.current = connectedScales
  const tableRef = useCallback(table => {
    if(table) {
      table.widget.rows.on('select', (item, index) => {
        dispatch({
          type: 'scaleSelected',
          payload: {selectedScale: Object.values(connectedScalesRef.current)[index]}
        })
      })
    }
  }, [])

  return(

    <box 
      class={stylesheet.bordered}
      label="Connected Scales"
      {...rest}
    >

    <button
      name="refresh"
      onPress={() => {refreshScales()}}
      keys
      mouse
      height={3}
      width={9}
      top="100%-5"
      left="100%-11"
      class={stylesheet.bordered}

    >
      Refresh
    </button>

    <Table
      ref={tableRef}
      mouse={ true }
      keys={ true }
      interactive={true}
      top={0}
      height="100%-2"
      width="100%-11"

        //style={{
        //      item: { fg: 'magenta' },
        //      selected: { fg: 'black', bg: 'magenta' },
        //    }}
      data={{
        headers: ['Address'],
        data: Object.values(connectedScales).map(scale => [scale.address.toString()])
      }}
      columnWidth={[10]}
    />
    </box>
    )
}

export default ConnectedScales
