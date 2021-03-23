import React, { useState } from 'react'


function TableRow(props){

    let displayRow = props.rowContent
    if(props.preDisplay){
        displayRow = props.preDisplay(props.rowContent)
        }

    return(
        
        <tr>
            { props.keyOrder.map(key => <td>{displayRow[key]}</td>) }
            {props.actions ? 
            <td> {props.actions.map(item =><input type={item.type} value={item.value} onClick={(e) => item.action(e, props.rowContent)}/>)}</td>:""}
             
        </tr>

    )
}

export default TableRow