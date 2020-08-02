import React from 'react'

function TableRow(props){
    return(
        <tr>
            { props.keyOrder.map(key => <td>{props.rowContent[key]}</td>) }
            {props.actions ? 
            <td> {props.actions.map(actionComponent =><button onClick={() => actionComponent.action(props.rowContent)}>{actionComponent.text}</button> )}</td>:""}
             
        </tr>

    )
}

export default TableRow